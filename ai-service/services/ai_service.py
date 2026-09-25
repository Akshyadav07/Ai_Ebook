from openai import AsyncOpenAI
import os
from typing import List
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
    ContinueWritingRequest, ContinueWritingResponse,
    Section, Chapter
)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY")
        self.model = os.getenv("MODEL_NAME", "gpt-3.5-turbo")
        if self.api_key:
            self.client = AsyncOpenAI(api_key=self.api_key)
        else:
            self.client = None

    async def generate_book(self, request: BookGenerationRequest) -> BookGenerationResponse:
        prompt = self._get_book_generation_prompt(request)
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert book writer and content creator."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=4000
                )
                content = response.choices[0].message.content
                return self._parse_book_response(content, request)
            else:
                return self._get_mock_book_response(request)
        except Exception as e:
            # Fallback to mock response if API fails
            return self._get_mock_book_response(request)

    def _get_book_generation_prompt(self, request: BookGenerationRequest) -> str:
        return f"""
Generate a comprehensive book structure based on the following requirements:

Title: {request.title}
Topic: {request.topic}
Description: {request.description or 'Not specified'}
Target Audience: {request.target_audience or 'General audience'}
Language: {request.language}
Writing Style: {request.writing_style or 'Professional and educational'}
Number of Chapters: {request.number_of_chapters}
Approximate Chapter Length: {request.approximate_chapter_length or '1000'} words
Additional Instructions: {request.additional_instructions or 'None'}

Requirements:
1. Create exactly {request.number_of_chapters} chapters
2. Each chapter should have meaningful content relevant to the topic
3. Include an introduction and conclusion
4. Follow the specified writing style
5. Target the specified audience
6. Write in the specified language
7. Structure the response as valid JSON with the following format:
{{
  "title": "Book Title",
  "description": "Book description",
  "introduction": "Introduction content...",
  "chapters": [
    {{
      "chapter_number": 1,
      "title": "Chapter Title",
      "content": "Chapter content...",
      "sections": [
        {{
          "title": "Section Title",
          "content": "Section content..."
        }}
      ]
    }}
  ],
  "conclusion": "Conclusion content..."
}}

Ensure the JSON is valid and properly formatted. Do not include markdown code blocks.
"""

    def _parse_book_response(self, content: str, request: BookGenerationRequest) -> BookGenerationResponse:
        try:
            import json
            # Try to extract JSON from the response
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            data = json.loads(content)
            
            chapters = []
            for i, chapter_data in enumerate(data.get("chapters", []), 1):
                sections = []
                for j, section_data in enumerate(chapter_data.get("sections", []), 1):
                    sections.append(Section(
                        title=section_data.get("title", f"Section {j}"),
                        content=section_data.get("content", "")
                    ))
                
                chapters.append(Chapter(
                    chapter_number=chapter_data.get("chapter_number", i),
                    title=chapter_data.get("title", f"Chapter {i}"),
                    content=chapter_data.get("content", ""),
                    sections=sections
                ))
            
            return BookGenerationResponse(
                title=data.get("title", request.title),
                description=data.get("description", request.description),
                introduction=data.get("introduction", ""),
                chapters=chapters,
                conclusion=data.get("conclusion", "")
            )
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return self._get_mock_book_response(request)

    def _get_mock_book_response(self, request: BookGenerationRequest) -> BookGenerationResponse:
        chapters = []
        for i in range(1, request.number_of_chapters + 1):
            chapters.append(Chapter(
                chapter_number=i,
                title=f"Chapter {i}: {request.topic} - Part {i}",
                content=f"This is the content for Chapter {i}. In this chapter, we will explore various aspects of {request.topic} tailored for {request.target_audience or 'general readers'}. The content follows a {request.writing_style or 'professional'} writing style and is written in {request.language}.",
                sections=[
                    Section(
                        title=f"Introduction to Part {i}",
                        content=f"This section introduces the key concepts for Chapter {i}."
                    ),
                    Section(
                        title=f"Key Concepts",
                        content=f"This section covers the main topics and details."
                    )
                ]
            ))
        
        return BookGenerationResponse(
            title=request.title,
            description=request.description,
            introduction=f"Welcome to '{request.title}'. This book explores {request.topic} in depth, designed specifically for {request.target_audience or 'readers interested in this subject'}.",
            chapters=chapters,
            conclusion=f"In conclusion, this book has provided a comprehensive overview of {request.topic}. We hope this resource has been valuable for your learning journey."
        )

    async def generate_chapter(self, request: ChapterGenerationRequest) -> ChapterGenerationResponse:
        prompt = f"""
Generate content for a book chapter with the following details:

Book Title: {request.book_title}
Book Topic: {request.book_topic}
Chapter Title: {request.chapter_title}
Chapter Number: {request.chapter_number}
Writing Style: {request.writing_style or 'Professional'}
Target Audience: {request.target_audience or 'General audience'}
Language: {request.language}
Existing Content: {request.existing_content or 'None'}

Generate comprehensive chapter content that:
1. Matches the chapter title
2. Fits the overall book theme
3. Uses the specified writing style
4. Targets the specified audience
5. Is written in the specified language
6. Builds upon any existing content if provided

Provide the content in a clear, well-structured format suitable for an educational book.
"""

        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert book writer and content creator."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
                content = response.choices[0].message.content
                return ChapterGenerationResponse(content=content)
            else:
                return ChapterGenerationResponse(
                    content=f"This is the generated content for Chapter {request.chapter_number}: {request.chapter_title}. "
                    f"The content covers the topic of {request.book_topic} in detail, following a {request.writing_style or 'professional'} "
                    f"writing style. It is designed for {request.target_audience or 'general readers'} and is written in {request.language}. "
                    f"This chapter explores key concepts and provides practical examples related to {request.chapter_title}."
                )
        except Exception as e:
            return ChapterGenerationResponse(
                content=f"This is the generated content for Chapter {request.chapter_number}: {request.chapter_title}. "
                f"The content covers the topic of {request.book_topic} in detail, following a {request.writing_style or 'professional'} "
                f"writing style. It is designed for {request.target_audience or 'general readers'} and is written in {request.language}. "
                f"This chapter explores key concepts and provides practical examples related to {request.chapter_title}."
            )

    async def improve_content(self, request: ContentImprovementRequest) -> ContentImprovementResponse:
        prompt = f"Improve the following text to make it more engaging, clear, and well-structured:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert editor and writer."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.5,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return ContentImprovementResponse(content=content)
            else:
                return ContentImprovementResponse(content=request.content)
        except Exception as e:
            return ContentImprovementResponse(content=request.content)

    async def rewrite_content(self, request: ContentRewriteRequest) -> ContentRewriteResponse:
        prompt = f"Rewrite the following text in a {request.style} style:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert writer who can adapt content to different styles."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return ContentRewriteResponse(content=content)
            else:
                return ContentRewriteResponse(content=request.content)
        except Exception as e:
            return ContentRewriteResponse(content=request.content)

    async def summarize_content(self, request: ContentSummarizeRequest) -> ContentSummarizeResponse:
        prompt = f"Summarize the following text concisely:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at creating clear, concise summaries."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=500
                )
                content = response.choices[0].message.content
                return ContentSummarizeResponse(content=content)
            else:
                return ContentSummarizeResponse(content=request.content[:200] + "...")
        except Exception as e:
            return ContentSummarizeResponse(content=request.content[:200] + "...")

    async def expand_content(self, request: ContentExpandRequest) -> ContentExpandResponse:
        prompt = f"Expand the following text with more details, examples, and explanations:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at expanding content with relevant details."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1500
                )
                content = response.choices[0].message.content
                return ContentExpandResponse(content=content)
            else:
                return ContentExpandResponse(content=request.content + "\n\n[Additional details and examples would be added here with AI expansion.]")
        except Exception as e:
            return ContentExpandResponse(content=request.content + "\n\n[Additional details and examples would be added here with AI expansion.]")

    async def simplify_content(self, request: ContentSimplifyRequest) -> ContentSimplifyResponse:
        prompt = f"Simplify the following text to make it easier to understand:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at explaining complex topics simply."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.5,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return ContentSimplifyResponse(content=content)
            else:
                return ContentSimplifyResponse(content=request.content)
        except Exception as e:
            return ContentSimplifyResponse(content=request.content)

    async def fix_grammar(self, request: GrammarFixRequest) -> GrammarFixResponse:
        prompt = f"Fix any grammar, spelling, and punctuation errors in the following text:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert editor with perfect grammar."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return GrammarFixResponse(content=content)
            else:
                return GrammarFixResponse(content=request.content)
        except Exception as e:
            return GrammarFixResponse(content=request.content)

    async def generate_examples(self, request: ExamplesRequest) -> ExamplesResponse:
        prompt = f"Generate practical examples related to the following topic:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert at creating practical, real-world examples."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return ExamplesResponse(content=content)
            else:
                return ExamplesResponse(content="Example 1: [A practical example related to the topic]\n\nExample 2: [Another relevant example]\n\nExample 3: [A third example to illustrate the concept]")
        except Exception as e:
            return ExamplesResponse(content="Example 1: [A practical example related to the topic]\n\nExample 2: [Another relevant example]\n\nExample 3: [A third example to illustrate the concept]")

    async def continue_writing(self, request: ContinueWritingRequest) -> ContinueWritingResponse:
        prompt = f"Continue writing from where the following text leaves off, maintaining the same style and context:\n\n{request.content}"
        
        try:
            if self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert writer who can seamlessly continue text."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                content = response.choices[0].message.content
                return ContinueWritingResponse(content=content)
            else:
                return ContinueWritingResponse(content="[Continuation of the text would be generated here by AI, maintaining the same style and context.]")
        except Exception as e:
            return ContinueWritingResponse(content="[Continuation of the text would be generated here by AI, maintaining the same style and context.]")
