import { signOut, auth } from "@/auth";

export default async function Page() {
    const session = await auth();

    const handleSignOut = async () => {
        "use server";
        await signOut();
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}
