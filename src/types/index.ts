export interface Course {
    id: number;
    name: string;
    description: string | null;
    academicYear: string | null;
    enrollmentUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    organizationId: number;
    createdById: number;
    organization?: Organization;
    createdBy?: User;
    images?: CourseImage[];
    courseCategories?: CourseCategory[];
}

export interface CourseImage {
    id: number;
    courseId: number;
    imageUrl: string;
    isMain: boolean;
}

export interface CourseCategory {
    courseId: number;
    categoryId: number;
    course?: Course;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Organization {
    id: number;
    name: string;
    description: string | null;
    websiteUrl: string | null;
    contactEmail: string | null;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    roleId: number;
    fullName: string;
    email: string;
    isActive: boolean;
}

export interface CourseLead {
    id: number;
    courseId: number;
    userId: number | null;
    fullName: string;
    email: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

export interface CreateCourseLeadDto {
    courseId: number;
    fullName: string;
    email: string;
    userId?: number;
}

export interface CoursesResponse {
    data: Course[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface FilterCourseDto {
    categoryId?: number;
    organizationId?: number;
    academicYear?: string;
    page?: number;
    limit?: number;
    includeInactive?: boolean;
}

export interface CreateCourseDto {
    organizationId: number;
    name: string;
    description: string;
    academicYear?: string;
    enrollmentUrl: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    categoryIds?: number[];
}

export interface UpdateCourseDto {
    organizationId?: number;
    name?: string;
    description?: string;
    academicYear?: string;
    enrollmentUrl?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    categoryIds?: number[];
}

export interface CreateOrganizationDto {
    name: string;
    description?: string;
    websiteUrl?: string;
    contactEmail?: string;
    logoUrl?: string;
}

export interface UpdateOrganizationDto {
    name?: string;
    description?: string;
    websiteUrl?: string;
    contactEmail?: string;
    logoUrl?: string;
}

export interface ImportRowError {
    fila: number;
    motivo: string;
}

export interface ImportResult {
    importados: number;
    omitidos: number;
    errores: ImportRowError[];
}

export type AdminRole = 'superadmin' | 'admin' | 'user';

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: AdminUser;
}

export interface ViewCountResponse {
    viewCount: number;
}

