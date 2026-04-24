/**
 * Base configured fetch client that would typically handle auth tokens,
 * base URL configuration, and global error handling.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` -> Handled here in real app
    },
  };

  const config = { ...defaultOptions, ...options };
  
  // In a real app: const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
  // We use mock promises to simulate network delay for demonstration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null as any); 
    }, 500);
  });
}
