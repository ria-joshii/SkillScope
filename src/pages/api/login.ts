import { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  role: "student" | "teacher";
  token?: string;
  error?: string;
}

// Mock user database - in production, this would be a real database
const mockUsers = [
  {
    email: "student@rutgers.edu",
    password: "password123",
    role: "student" as const,
    name: "Sarah Johnson",
    studentId: "STU2024001"
  },
  {
    email: "teacher@rutgers.edu", 
    password: "password123",
    role: "teacher" as const,
    name: "Dr. Michael Chen",
    teacherId: "TCH2024001"
  },
  {
    email: "admin@rutgers.edu",
    password: "password123", 
    role: "teacher" as const,
    name: "Dr. Admin User",
    teacherId: "ADM2024001"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user in mock database
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a simple token (in production, use JWT)
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64');

  // Return success response
  res.status(200).json({
    role: user.role,
    token: token,
  });
}
