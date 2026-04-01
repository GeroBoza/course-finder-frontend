'use client';

import { useRef, useState } from 'react';
import { coursesService } from '@/services/courses.service';
import type { ImportResult } from '@/types';
import Button from '@/components/Button';

const ACCEPTED_EXTENSIONS = ['.xlsx'];
const MAX_SIZE_MB = 5;

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

// ─── Result summary panel ─────────────────────────────────────────────────────

function ImportResultPanel({ result, onReset }: { result: ImportResult; onReset: () => void }) {
    const hasErrors = result.errores.length > 0;

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-extrabold text-green-700">{result.importados}</p>
                    <p className="text-sm font-medium text-green-600 mt-1">Importados</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-extrabold text-amber-600">{result.omitidos}</p>
                    <p className="text-sm font-medium text-amber-500 mt-1">Omitidos (duplicados)</p>
                </div>
                <div className={`rounded-2xl p-5 text-center border ${hasErrors ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-3xl font-extrabold ${hasErrors ? 'text-red-600' : 'text-gray-400'}`}>
                        {result.errores.length}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${hasErrors ? 'text-red-500' : 'text-gray-400'}`}>
                        Errores
                    </p>
                </div>
            </div>

            {/* Error detail */}
            {hasErrors && (
                <div className="bg-white border border-red-200 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 bg-red-50 border-b border-red-200">
                        <p className="text-sm font-semibold text-red-700">Detalle de errores</p>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                        {result.errores.map((err, i) => (
                            <div key={i} className="flex items-start gap-3 px-5 py-3">
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 mt-0.5 flex-shrink-0">
                                    Fila {err.fila}
                                </span>
                                <p className="text-sm text-gray-700">{err.motivo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Button href="/dashboard/courses" variant="primary" size="md">
                    Ver cursos
                </Button>
                <button
                    onClick={onReset}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    Importar otro archivo
                </button>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ImportCoursesPage() {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [result, setResult] = useState<ImportResult | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            return `Formato no soportado. Solo se aceptan archivos: ${ACCEPTED_EXTENSIONS.join(', ')}`;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `El archivo supera el tamaño máximo permitido de ${MAX_SIZE_MB} MB.`;
        }
        return null;
    };

    const handleFileSelect = (file: File) => {
        const error = validateFile(file);
        setValidationError(error);
        setSelectedFile(error ? null : file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploadState('uploading');
        setUploadError(null);
        try {
            const res = await coursesService.importFile(selectedFile);
            setResult(res);
            setUploadState('done');
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Error desconocido al procesar el archivo.');
            setUploadState('error');
        }
    };

    const handleReset = () => {
        setUploadState('idle');
        setSelectedFile(null);
        setValidationError(null);
        setUploadError(null);
        setResult(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="max-w-2xl animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Button href="/dashboard/courses" variant="secondary" size="sm" className="mb-4 !bg-transparent !shadow-none text-gray-500 hover:text-gray-800 pl-0">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </Button>
                <h1 className="text-3xl font-extrabold text-gray-900">Importar cursos</h1>
                <p className="text-gray-500 mt-1">
                    Subí un archivo <span className="font-semibold text-gray-700">.xlsx</span> con el formato correcto para cargar múltiples cursos a la vez.
                </p>
            </div>

            {uploadState === 'done' && result ? (
                <ImportResultPanel result={result} onReset={handleReset} />
            ) : (
                <div className="space-y-6">
                    {/* Template info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Formato del archivo</p>
                        <p className="text-sm text-blue-700 mb-3">
                            El archivo debe ser un <strong>.xlsx</strong> con la primera fila como encabezados. Las columnas deben seguir este orden:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="text-xs w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-100">
                                        {['Nombre *', 'Descripcion', 'Organizacion *', 'URL Inscripcion *', 'Anio Academico', 'Fecha Inicio', 'Fecha Fin', 'Categorias', 'Activo'].map((h) => (
                                            <th key={h} className="px-2 py-1.5 text-left font-semibold text-blue-800 border border-blue-200 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white">
                                        {['Curso de Python', 'Aprenderás...', 'UADE', 'https://...', '2025', '15/03/2025', '30/06/2025', 'Tech, Prog', 'SI'].map((v, i) => (
                                            <td key={i} className="px-2 py-1.5 text-gray-500 border border-blue-100 whitespace-nowrap italic">
                                                {v}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">* Campos obligatorios. Fechas en formato DD/MM/YYYY. Categorías separadas por coma.</p>
                    </div>

                    {/* Drop zone */}
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl px-8 py-12 text-center transition-all duration-200 ${
                            dragOver
                                ? 'border-blue-400 bg-blue-50'
                                : selectedFile
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                        }`}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx"
                            onChange={handleInputChange}
                            className="hidden"
                        />

                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {(selectedFile.size / 1024).toFixed(1)} KB · Clic para cambiar
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Arrastrá tu archivo acá o{' '}
                                        <span className="text-blue-600 underline">buscalo</span>
                                    </p>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Solo archivos .xlsx · Máx. {MAX_SIZE_MB} MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Validation error */}
                    {validationError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationError}
                        </div>
                    )}

                    {/* Upload error */}
                    {uploadState === 'error' && uploadError && (
                        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {uploadError}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={handleUpload}
                            className={(!selectedFile || uploadState === 'uploading') ? 'opacity-60 cursor-not-allowed' : ''}
                        >
                            {uploadState === 'uploading' ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Procesando...
                                </span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Importar cursos
                                </>
                            )}
                        </Button>
                        {selectedFile && uploadState !== 'uploading' && (
                            <button
                                onClick={handleReset}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
