
import { createClient } from "../../lib/supabase/server.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import ReviewPageHeader from "../../components/ReviewPageHeader.js";

async function ReviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={{ padding: "48px 24px", color: "#8B3030" }}>
        <p>You are not authorized to access this page.</p>
      </main>
    );
  }

  const { data: isReviewer, error: reviewerError } =
    await supabase.rpc("is_reviewer");

  if (reviewerError) throw reviewerError;

  if (isReviewer !== true) {
    return (
      <main style={{ padding: "48px 24px", color: "#8B3030" }}>
        <p>You are not authorized to access this page.</p>
      </main>
    );
  }

  const { data, error: fetchError } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (fetchError) throw fetchError;

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "32px 24px 0",
        color: "#234F3D",
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <ReviewPageHeader />

      <ReviewQueue entries={data || []} />
    </main>
  );
}

export default ReviewPage;
