import { auth0 } from "@/lib/auth0";
import "./globals.css";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";

export default async function Home() {
    const session = await auth0.getSession();

    if (!session) {
        return (
            <main>
                <a href="/auth/login?screen_hint=signup"><button>Sign up</button></a>
                <a href="/auth/login"><button>Log in</button></a>
            </main>
        );
    }

    // Conectar a Mongo y guardar usuario si no existe
    await connectToDB();
    const existingUser = await User.findOne({ auth0Id: session.user.sub });

    if (!existingUser) {
        await User.create({
            auth0Id: session.user.sub,
            email: session.user.email,
            name: session.user.name,
        });
        console.log("Nuevo usuario guardado en MongoDB");
    }

    return (
        <main>
            <h1>Welcome, {session.user.name}!</h1>
            <p><a href="/auth/logout"><button>Log out</button></a></p>
        </main>
    );
}
