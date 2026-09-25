<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Chapter;
use App\Models\Book;
use Illuminate\Support\Facades\Http;

class ChapterController extends Controller
{
    public function index(Request $request, $bookId)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        $chapters = $book->chapters()->with('sections')->orderBy('chapter_number')->get();
        return response()->json($chapters);
    }

    public function store(Request $request, $bookId)
    {
        $book = $request->user()->books()->findOrFail($bookId);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $maxChapterNumber = $book->chapters()->max('chapter_number') ?? 0;
        
        $chapter = $book->chapters()->create([
            'chapter_number' => $maxChapterNumber + 1,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($chapter, 201);
    }

    public function show(Request $request, $bookId, $id)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        $chapter = $book->chapters()->with('sections')->findOrFail($id);
        return response()->json($chapter);
    }

    public function update(Request $request, $bookId, $id)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        $chapter = $book->chapters()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
            'chapter_number' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $chapter->update($request->only(['title', 'content', 'chapter_number']));

        return response()->json($chapter);
    }

    public function destroy(Request $request, $bookId, $id)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        $chapter = $book->chapters()->findOrFail($id);
        $chapter->delete();
        
        $this->renumberChapters($book);
        
        return response()->json(['message' => 'Chapter deleted successfully']);
    }

    public function reorder(Request $request, $bookId)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        
        $validator = Validator::make($request->all(), [
            'chapters' => 'required|array',
            'chapters.*.id' => 'required|integer',
            'chapters.*.chapter_number' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->chapters as $chapterData) {
            $chapter = $book->chapters()->find($chapterData['id']);
            if ($chapter) {
                $chapter->update(['chapter_number' => $chapterData['chapter_number']]);
            }
        }

        return response()->json(['message' => 'Chapters reordered successfully']);
    }

    public function regenerate(Request $request, $bookId, $id)
    {
        $book = $request->user()->books()->findOrFail($bookId);
        $chapter = $book->chapters()->findOrFail($id);

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(120)->post($aiServiceUrl . '/generate-chapter', [
                'book_title' => $book->title,
                'book_topic' => $book->topic,
                'chapter_title' => $chapter->title,
                'chapter_number' => $chapter->chapter_number,
                'writing_style' => $book->writing_style,
                'target_audience' => $book->target_audience,
                'language' => $book->language,
                'existing_content' => $chapter->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            $aiData = $response->json();

            $chapter->update([
                'content' => $aiData['content'] ?? $chapter->content,
            ]);

            return response()->json($chapter);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Regeneration failed: ' . $e->getMessage()], 500);
        }
    }

    private function renumberChapters(Book $book)
    {
        $chapters = $book->chapters()->orderBy('chapter_number')->get();
        foreach ($chapters as $index => $chapter) {
            $chapter->update(['chapter_number' => $index + 1]);
        }
    }
}
