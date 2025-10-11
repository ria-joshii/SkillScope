import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Hardcoded users for demo (replace with DB later)
    const users = [
      { id: 1, email: 'admin@admin.com', password: 'admin', role: 'teacher', name: 'Admin User' },
      { id: 2, email: 'teacher@rutgers.edu', password: 'teacher', role: 'teacher', name: 'Dr. Michael Chen' },
      { id: 3, email: 'student@rutgers.edu', password: 'student', role: 'student', name: 'Sarah Johnson' },
    ];

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
