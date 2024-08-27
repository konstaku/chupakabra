import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="error">
            <b>Помилка сайту 😪</b>
            <p>
                Щось пішло не так, та ми не змогли обробити запит. Спробуйте ще
                раз або поверніться на <Link to="/">головну сторінку</Link>
            </p>
            <p>
                {error instanceof Error && (
                    <pre>{error.name || error.message}</pre>
                )}
            </p>
        </div>
    );
}
