<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function improve(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/improve-content', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function rewrite(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'style' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/rewrite-content', [
                'content' => $request->content,
                'style' => $request->style ?? 'professional',
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function summarize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/summarize-content', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function expand(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/expand-content', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function simplify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/simplify-content', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function fixGrammar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/fix-grammar', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function generateExamples(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/generate-examples', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }

    public function continueWriting(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://localhost:8000');
            
            $response = Http::timeout(60)->post($aiServiceUrl . '/continue-writing', [
                'content' => $request->content,
            ]);

            if (!$response->successful()) {
                return response()->json(['message' => 'AI service failed'], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['message' => 'AI request failed: ' . $e->getMessage()], 500);
        }
    }
}
