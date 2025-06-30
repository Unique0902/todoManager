from pydantic import BaseModel, Field, ConfigDict
from typing import Generic, TypeVar, Optional, List, Any
from datetime import datetime
import math

T = TypeVar('T')

class PaginationInfo(BaseModel):
    """페이지네이션 정보"""
    page: int = Field(..., ge=1, description="현재 페이지 번호")
    size: int = Field(..., ge=1, le=100, description="페이지 크기")
    total: int = Field(..., ge=0, description="전체 항목 수")
    total_pages: int = Field(..., ge=0, description="전체 페이지 수")
    
    @classmethod
    def create(cls, page: int, size: int, total: int) -> "PaginationInfo":
        """페이지네이션 정보 생성"""
        total_pages = math.ceil(total / size) if total > 0 else 0
        return cls(
            page=page,
            size=size,
            total=total,
            total_pages=total_pages
        )

class APIResponse(BaseModel, Generic[T]):
    """API 응답 공통 모델"""
    success: bool = Field(..., description="성공 여부")
    message: str = Field(..., description="응답 메시지")
    data: Optional[T] = Field(None, description="응답 데이터")
    pagination: Optional[PaginationInfo] = Field(None, description="페이지네이션 정보")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "요청이 성공적으로 처리되었습니다.",
                "data": None,
                "pagination": None
            }
        }
    )

class ErrorResponse(BaseModel):
    """에러 응답 모델"""
    success: bool = Field(False, description="성공 여부")
    message: str = Field(..., description="에러 메시지")
    error_code: str = Field(..., description="에러 코드")
    details: Optional[dict] = Field(None, description="상세 정보")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": False,
                "message": "요청한 리소스를 찾을 수 없습니다.",
                "error_code": "NOT_FOUND",
                "details": {
                    "resource": "goal",
                    "id": 999
                }
            }
        }
    )

class ListResponse(BaseModel, Generic[T]):
    """목록 응답 모델"""
    items: List[T] = Field(..., description="항목 목록")
    pagination: PaginationInfo = Field(..., description="페이지네이션 정보")

# 성공 응답 헬퍼 함수들
def success_response(
    message: str = "요청이 성공적으로 처리되었습니다.",
    data: Optional[Any] = None,
    pagination: Optional[PaginationInfo] = None
) -> dict:
    """성공 응답 생성"""
    return {
        "success": True,
        "message": message,
        "data": data,
        "pagination": pagination
    }

def list_response(
    items: List[Any],
    page: int,
    size: int,
    total: int,
    message: str = "목록을 성공적으로 조회했습니다."
) -> dict:
    """목록 응답 생성"""
    pagination = PaginationInfo.create(page, size, total)
    return success_response(message, items, pagination)

def error_response(
    message: str,
    error_code: str,
    details: Optional[dict] = None
) -> dict:
    """에러 응답 생성"""
    return {
        "success": False,
        "message": message,
        "error_code": error_code,
        "details": details
    }

# 페이지네이션 유틸리티
def get_pagination_params(page: int = 1, size: int = 20) -> tuple[int, int]:
    """페이지네이션 파라미터 검증 및 반환"""
    page = max(1, page)
    size = max(1, min(100, size))  # 1~100 사이로 제한
    return page, size

def calculate_offset(page: int, size: int) -> int:
    """오프셋 계산"""
    return (page - 1) * size 