export function formatViewCount(count: number): string {
    if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (count >= 1_000) {
        return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return count.toLocaleString('es-AR');
}

export function formatViewLabel(count: number): string {
    const formatted = formatViewCount(count);
    return count === 1 ? '1 visualización' : `${formatted} visualizaciones`;
}
