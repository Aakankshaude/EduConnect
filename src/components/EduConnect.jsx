import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function EduConnect() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'student' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [uploadForm, setUploadForm] = useState({ title: '', file: null });
  const [quizForm, setQuizForm] = useState({ question: '', options: '', answer: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => 
      u.email === loginForm.email && 
      u.password === loginForm.password && 
      u.role === loginForm.role
    );
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (users.some(u => u.email === registerForm.email)) {
      alert('Email already registered!');
      return;
    }
    setUsers([...users, registerForm]);
    alert('Registration successful! Please login.');
    setCurrentView('login');
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setContent([...content, { ...uploadForm, uploader: currentUser.email }]);
    alert('Content uploaded successfully!');
    setUploadForm({ title: '', file: null });
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    const options = quizForm.options.split(',').map(opt => opt.trim());
    setQuizzes([...quizzes, { 
      question: quizForm.question,
      options,
      answer: quizForm.answer,
      creator: currentUser.email 
    }]);
    alert('Quiz created successfully!');
    setQuizForm({ question: '', options: '', answer: '' });
  };

  const submitQuiz = (selectedAnswer) => {
    const currentQuiz = quizzes[quizzes.length - 1];
    if (selectedAnswer === currentQuiz.answer) {
      alert('Correct answer!');
    } else {
      alert('Incorrect answer. Try again!');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 p-3">EduConnect</h1>
          {!currentUser ? (
            <div>
              <Button onClick={() => setCurrentView('login')} className="mr-2">Login</Button>
              <Button onClick={() => setCurrentView('register')} variant="secondary">Register</Button>
            </div>
          ) : (
            <Button onClick={logout} variant="destructive">Logout</Button>
          )}
        </div>
      </nav>

      <div className="container mx-auto mt-10">
        {currentView === 'login' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={loginForm.email}
                    onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={loginForm.role}
                    onValueChange={value => setLoginForm({...loginForm, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentView === 'register' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    type="text"
                    value={registerForm.name}
                    onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={registerForm.email}
                    onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password"
                    value={registerForm.password}
                    onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={registerForm.role}
                    onValueChange={value => setRegisterForm({...registerForm, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentView === 'dashboard' && currentUser?.role === 'teacher' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Content</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      type="text"
                      value={uploadForm.title}
                      onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <Input 
                      type="file"
                      onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})}
                    />
                  </div>
                  <Button type="submit">Upload</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input 
                      type="text"
                      value={quizForm.question}
                      onChange={e => setQuizForm({...quizForm, question: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options (comma-separated)</Label>
                    <Input 
                      type="text"
                      value={quizForm.options}
                      onChange={e => setQuizForm({...quizForm, options: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Input 
                      type="text"
                      value={quizForm.answer}
                      onChange={e => setQuizForm({...quizForm, answer: e.target.value})}
                    />
                  </div>
                  <Button type="submit">Create Quiz</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'dashboard' && currentUser?.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-200 rounded-lg">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-600">Uploaded by: {item.uploader}</p>
                      <Button onClick={() => alert(`Downloading ${item.title}...`)}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {quizzes.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold">{quizzes[quizzes.length - 1].question}</h4>
                    <RadioGroup onValueChange={submitQuiz}>
                      {quizzes[quizzes.length - 1].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {quizzes.length === 0 && (
                  <p>No active quizzes available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}