from pydantic import BaseModel, Field
from typing import List, Optional

class BookGenerationRequest(BaseModel):
    title: str
    topic: str
    description: Optional[str] = None
    target_audience: Optional[str] = None
    language: str = "English"
    writing_style: Optional[str] = None
    number_of_chapters: int = Field(default=8, ge=1, le=20)
    approximate_chapter_length: Optional[int] = None
    additional_instructions: Optional[str] = None

class Section(BaseModel):
    title: str
    content: Optional[str] = None

class Chapter(BaseModel):
    chapter_number: int
    title: str
    content: str
    sections: List[Section] = []

class BookGenerationResponse(BaseModel):
    title: str
    description: Optional[str] = None
    introduction: Optional[str] = None
    chapters: List[Chapter]
    conclusion: Optional[str] = None

class ChapterGenerationRequest(BaseModel):
    book_title: str
    book_topic: str
    chapter_title: str
    chapter_number: int
    writing_style: Optional[str] = None
    target_audience: Optional[str] = None
    language: str = "English"
    existing_content: Optional[str] = None

class ChapterGenerationResponse(BaseModel):
    content: str

class ContentImprovementRequest(BaseModel):
    content: str

class ContentImprovementResponse(BaseModel):
    content: str

class ContentRewriteRequest(BaseModel):
    content: str
    style: str = "professional"

class ContentRewriteResponse(BaseModel):
    content: str

class ContentSummarizeRequest(BaseModel):
    content: str

class ContentSummarizeResponse(BaseModel):
    content: str

class ContentExpandRequest(BaseModel):
    content: str

class ContentExpandResponse(BaseModel):
    content: str

class ContentSimplifyRequest(BaseModel):
    content: str

class ContentSimplifyResponse(BaseModel):
    content: str

class GrammarFixRequest(BaseModel):
    content: str

class GrammarFixResponse(BaseModel):
    content: str

class ExamplesRequest(BaseModel):
    content: str

class ExamplesResponse(BaseModel):
    content: str

class ContinueWritingRequest(BaseModel):
    content: str

class ContinueWritingResponse(BaseModel):
    content: str
