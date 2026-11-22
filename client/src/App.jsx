import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Home from "./Home.jsx";
import CodingProjects from "./CodingProjects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Newsletter from "./Newsletter.jsx";
import NewsletterDetail from "./NewsletterDetail.jsx";
import Books from "./Books.jsx";
import TravelMap from './TravelMap';
import AuthProvider from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import Login from './auth/Login';
import Register from './auth/Register';
import ResetPassword from './auth/ResetPassword';
import AdminPage from './admin/AdminPage';
import SiteProvider from './site/SiteProvider';

// Everything except the auth pages requires a logged-in user.
function SiteLayout() {
    return (
        <RequireAuth>
            {/* Site-wide copy is private, so it's only fetched once logged in. */}
            <SiteProvider>
                <Navbar />
                <main className="site-main">
                    <Outlet />
                </main>
            </SiteProvider>
        </RequireAuth>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route element={<SiteLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/coding-projects" element={<CodingProjects />} />
                        <Route path="/coding-projects/:id" element={<ProjectDetail />} />
                        <Route path="/study-abroad-newsletter" element={<Newsletter />} />
                        <Route path="/study-abroad-newsletter/:slug" element={<NewsletterDetail />} />
                        <Route path="/what-im-reading" element={<Books />} />
                        <Route path="/around-the-world" element={<TravelMap />} />
                        <Route path="/admin" element={<RequireAuth admin><AdminPage /></RequireAuth>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
