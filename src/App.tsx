/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import AppLayout from './components/shared/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './context/NotificationContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NavBlockProvider } from './context/NavBlockContext';

// Lazy load pages for performance
const Landing = lazy(() => import('./pages/Landing/index'));
const Login = lazy(() => import('./pages/Login'));
const Onboarding = lazy(() => import('./pages/Onboarding/index'));
const Tutorial = lazy(() => import('./pages/Tutorial'));
const Chat = lazy(() => import('./pages/Chat'));
const Question = lazy(() => import('./pages/Question/index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IRTSimulation = lazy(() => import('./pages/IRTSimulation'));
const Progress = lazy(() => import('./pages/Progress'));
const Vocab = lazy(() => import('./pages/Vocab'));
const EYDTest = lazy(() => import('./pages/EYDTest'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const PlaylistExplore = lazy(() => import('./pages/Playlist/Explore'));
const MyPlaylists = lazy(() => import('./pages/Playlist/MyPlaylists'));
const PlaylistEditor = lazy(() => import('./pages/Playlist/Editor'));
const PlaylistDetail = lazy(() => import('./pages/Playlist/Detail'));
const AmbisBattle = lazy(() => import('./pages/AmbisBattle'));
const PTNPediaHub = lazy(() => import('./pages/PTNPedia/Hub'));
const PTNPediaGrade = lazy(() => import('./pages/PTNPedia/Grade'));
const PTNInsightList = lazy(() => import('./pages/PTNPedia/InsightList'));
const PTNInsightDetail = lazy(() => import('./pages/PTNPedia/InsightDetail'));
const StudentLevels = lazy(() => import('./pages/StudentLevels'));
const Legal = lazy(() => import('./pages/Legal'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FeaturesHub = lazy(() => import('./pages/FeaturesHub'));

import { PageLoader } from './components/shared/PageLoader';

const RootLoader = () => {
  const isLanding = window.location.pathname === '/';
  return <PageLoader isLanding={isLanding} />;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <NavBlockProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <ProgressProvider>
                <div className="min-h-screen premium-bg text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 transition-colors duration-500">
                  <Suspense fallback={<RootLoader />}>
                    <Outlet />
                  </Suspense>
                </div>
              </ProgressProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </NavBlockProvider>
    ),
    children: [
      { path: "/", element: <><Navbar /><main className="pt-16"><Landing /></main></> },
      { path: "/auth/login", element: <><Navbar /><main className="pt-16"><Login /></main></> },
      
      { path: "/onboarding", element: <ProtectedRoute><AppLayout><Onboarding /></AppLayout></ProtectedRoute> },
      { path: "/tutorial", element: <ProtectedRoute><AppLayout><Tutorial /></AppLayout></ProtectedRoute> },
      { path: "/chat", element: <ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute> },
      { path: "/question/:slug", element: <ProtectedRoute><AppLayout><Question /></AppLayout></ProtectedRoute> },
      
      { path: "/dashboard", element: <Navigate to="/dashboard/overview" replace /> },
      { path: "/dashboard/:section", element: <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute> },
      
      { path: "/irt-simulation", element: <ProtectedRoute><AppLayout><IRTSimulation /></AppLayout></ProtectedRoute> },
      
      { path: "/ptnpedia", element: <ProtectedRoute><AppLayout><PTNPediaHub /></AppLayout></ProtectedRoute> },
      { path: "/ptnpedia/ptn-grade", element: <ProtectedRoute><AppLayout><PTNPediaGrade /></AppLayout></ProtectedRoute> },
      { path: "/ptnpedia/ptn-insight", element: <ProtectedRoute><AppLayout><PTNInsightList /></AppLayout></ProtectedRoute> },
      { path: "/ptnpedia/ptn-insight/:ptnId", element: <ProtectedRoute><AppLayout><PTNInsightDetail /></AppLayout></ProtectedRoute> },
      
      { path: "/fiturambis/progress", element: <ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute> },
      { path: "/fiturambis/vocab", element: <ProtectedRoute><AppLayout><Vocab /></AppLayout></ProtectedRoute> },
      { path: "/fiturambis/eyd-test", element: <ProtectedRoute><AppLayout><EYDTest /></AppLayout></ProtectedRoute> },
      { path: "/fiturambis/wishlist", element: <ProtectedRoute><AppLayout><Wishlist /></AppLayout></ProtectedRoute> },
      { path: "/fiturambis/ambisbattle", element: <ProtectedRoute><AppLayout><AmbisBattle /></AppLayout></ProtectedRoute> },
      { path: "/fitur", element: <ProtectedRoute><AppLayout><FeaturesHub /></AppLayout></ProtectedRoute> },
      
      { path: "/playlist/explore", element: <ProtectedRoute><AppLayout><PlaylistExplore /></AppLayout></ProtectedRoute> },
      { path: "/playlist/mine", element: <ProtectedRoute><AppLayout><MyPlaylists /></AppLayout></ProtectedRoute> },
      { path: "/playlist/create", element: <ProtectedRoute><AppLayout><PlaylistEditor /></AppLayout></ProtectedRoute> },
      { path: "/playlist/edit/:id", element: <ProtectedRoute><AppLayout><PlaylistEditor /></AppLayout></ProtectedRoute> },
      { path: "/playlist/:slug", element: <ProtectedRoute><AppLayout><PlaylistDetail /></AppLayout></ProtectedRoute> },
      
      { path: "/student-levels", element: <ProtectedRoute><AppLayout><StudentLevels /></AppLayout></ProtectedRoute> },
      { path: "/legal/:type", element: <><Navbar /><main className="pt-16"><Legal /></main></> },
      { path: "/about", element: <><Navbar /><main className="pt-16"><About /></main></> },
      { path: "/contact", element: <><Navbar /><main className="pt-16"><Contact /></main></> },
      
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={appRouter} />
    </HelmetProvider>
  );
}
