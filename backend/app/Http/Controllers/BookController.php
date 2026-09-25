<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Book;
use App\Models\Chapter;
use Illuminate\Support\Facades\Http;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = $request->user()->books()->withCount('chapters')->latest()->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'topic' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_audience' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'writing_style' => 'nullable|string|max:255',
            'number_of_chapters' => 'required|integer|min:1|max:20',
            'approximate_chapter_length' => 'nullable|integer',
            'additional_instructions' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = $request->user()->books()->create([
            'title' => $request->title,
            'topic' => $request->topic,
            'description' => $request->description,
            'target_audience' => $request->target_audience,
            'language' => $request->language ?? 'English',
            'writing_style' => $request->writing_style,
            'number_of_chapters' => $request->number_of_chapters,
            'approximate_chapter_length' => $request->approximate_chapter_length,
            'additional_instructions' => $request->additional_instructions,
            'status' => 'draft',
        ]);

        return response()->json($book, 201);
    }

    public function show(Request $request, $id)
    {
        $book = $request->user()->books()->with('chapters.sections')->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'topic' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'target_audience' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'writing_style' => 'nullable|string|max:255',
            'introduction' => 'nullable|string',
            'conclusion' => 'nullable|string',
            'status' => 'sometimes|in:draft,generating,completed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book->update($request->only([
            'title', 'topic', 'description', 'target_audience', 
            'language', 'writing_style', 'introduction', 'conclusion', 'status'
        ]));

        return response()->json($book);
    }

    public function destroy(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }

    public function generate(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        
        if ($book->status === 'generating') {
            return response()->json(['message' => 'Book is already being generated'], 400);
        }

        $book->update(['status' => 'generating']);

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(300)->post($aiServiceUrl . '/generate-book', [
                'title' => $book->title,
                'topic' => $book->topic,
                'description' => $book->description,
                'target_audience' => $book->target_audience,
                'language' => $book->language,
                'writing_style' => $book->writing_style,
                'number_of_chapters' => $book->number_of_chapters,
                'approximate_chapter_length' => $book->approximate_chapter_length,
                'additional_instructions' => $book->additional_instructions,
            ]);

            if (!$response->successful()) {
                $book->update(['status' => 'draft']);
                return response()->json(['message' => 'AI service failed'], 500);
            }

            $aiData = $response->json();

            if (!$this->validateAiResponse($aiData)) {
                $book->update(['status' => 'draft']);
                return response()->json(['message' => 'Invalid AI response structure'], 500);
            }

            $book->update([
                'introduction' => $aiData['introduction'] ?? null,
                'conclusion' => $aiData['conclusion'] ?? null,
                'status' => 'completed',
            ]);

            foreach ($aiData['chapters'] as $chapterData) {
                $chapter = $book->chapters()->create([
                    'chapter_number' => $chapterData['chapter_number'],
                    'title' => $chapterData['title'],
                    'content' => $chapterData['content'],
                ]);

                if (isset($chapterData['sections']) && is_array($chapterData['sections'])) {
                    foreach ($chapterData['sections'] as $index => $sectionData) {
                        $chapter->sections()->create([
                            'title' => $sectionData['title'] ?? 'Section ' . ($index + 1),
                            'content' => $sectionData['content'] ?? null,
                            'order' => $index,
                        ]);
                    }
                }
            }

            return response()->json($book->load('chapters.sections'));

        } catch (\Exception $e) {
            $book->update(['status' => 'draft']);
            return response()->json(['message' => 'Generation failed: ' . $e->getMessage()], 500);
        }
    }

    private function validateAiResponse($data)
    {
        return isset($data['title']) && 
               isset($data['chapters']) && 
               is_array($data['chapters']) &&
               count($data['chapters']) > 0;
    }

    public function duplicate(Request $request, $id)
    {
        $originalBook = $request->user()->books()->with('chapters.sections')->findOrFail($id);
        
        $newBook = $originalBook->replicate();
        $newBook->title = $originalBook->title . ' (Copy)';
        $newBook->status = 'draft';
        $newBook->save();

        foreach ($originalBook->chapters as $originalChapter) {
            $newChapter = $originalChapter->replicate();
            $newChapter->book_id = $newBook->id;
            $newChapter->save();

            foreach ($originalChapter->sections as $originalSection) {
                $newSection = $originalSection->replicate();
                $newSection->chapter_id = $newChapter->id;
                $newSection->save();
            }
        }

        return response()->json($newBook->load('chapters.sections'), 201);
    }
}
