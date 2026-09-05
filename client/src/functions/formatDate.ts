//04/09/2026 17:45:04 -> 4th September 2026, 17:45
export default function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();

    const suffix =
        day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' :
                    'th';

    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}${suffix} ${month} ${year}, ${hours}:${minutes}`;
}