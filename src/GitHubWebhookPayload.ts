export default interface GitHubWebhookPayload {
  ref: string;
  head_commit: {
    id: string;
  };
  repository: {
    name: string;
  };
}
