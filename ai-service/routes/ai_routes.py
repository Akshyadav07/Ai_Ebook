from fastapi import APIRouter, HTTPException
from models.schemas import (
    BookGenerationRequest, BookGenerationResponse,
    ChapterGenerationRequest, ChapterGenerationResponse,
    ContentImprovementRequest, ContentImprovementResponse,
    ContentRewriteRequest, ContentRewriteResponse,
    ContentSummarizeRequest, ContentSummarizeResponse,
    ContentExpandRequest, ContentExpandResponse,
    ContentSimplifyRequest, ContentSimplifyResponse,
    GrammarFixRequest, GrammarFixResponse,
    ExamplesRequest, ExamplesResponse,
    ContinueWritingRequest, ContinueWritingResponse
)
from services.ai_service import AIService
import os

router = APIRouter()
ai_service = AIService()

@router.post("/generate-book", response_model=BookGenerationResponse)
async def generate_book(request: BookGenerationRequest):
    try:
        return await ai_service.generate_book(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-chapter", response_model=ChapterGenerationResponse)
async def generate_chapter(request: ChapterGenerationRequest):
    try:
        return await ai_service.generate_chapter(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/improve-content", response_model=ContentImprovementResponse)
async def improve_content(request: ContentImprovementRequest):
    try:
        return await ai_service.improve_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rewrite-content", response_model=ContentRewriteResponse)
async def rewrite_content(request: ContentRewriteRequest):
    try:
        return await ai_service.rewrite_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize-content", response_model=ContentSummarizeResponse)
async def summarize_content(request: ContentSummarizeRequest):
    try:
        return await ai_service.summarize_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/expand-content", response_model=ContentExpandResponse)
async def expand_content(request: ContentExpandRequest):
    try:
        return await ai_service.expand_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simplify-content", response_model=ContentSimplifyResponse)
async def simplify_content(request: ContentSimplifyRequest):
    try:
        return await ai_service.simplify_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fix-grammar", response_model=GrammarFixResponse)
async def fix_grammar(request: GrammarFixRequest):
    try:
        return await ai_service.fix_grammar(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-examples", response_model=ExamplesResponse)
async def generate_examples(request: ExamplesRequest):
    try:
        return await ai_service.generate_examples(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/continue-writing", response_model=ContinueWritingResponse)
async def continue_writing(request: ContinueWritingRequest):
    try:
        return await ai_service.continue_writing(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
