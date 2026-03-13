import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * usePermissions Hook
 * Central place to define what each role can and cannot do.
 * Usage: const { canBookExperience, canBookGuide, ... } = usePermissions();
 */
const usePermissions = () => {
    const { user } = useContext(AuthContext);
    const role = user?.role || null; // null = not logged in

    return {
        // --- Viewing (Everyone can view) ---
        canViewAll: true,

        // --- Booking Experiences ---
        // Tourists can book. Guides can book (they're people too).
        // Organizers CANNOT book — they create experiences, not attend them as paying guests.
        canBookExperience: role === 'Tourist' || role === 'Guide',

        // --- Booking Guides ---
        // Tourists and Organizers can book a guide.
        // Guides CANNOT book other guides (no real use case).
        canBookGuide: role === 'Tourist' || role === 'Organizer',

        // --- Writing Reviews ---
        // Only Tourists can write reviews. 
        // Organizers cannot review (conflict of interest).
        // Guides cannot review experiences (they are service providers).
        canWriteReview: role === 'Tourist',

        // --- Creating Content ---
        // Only Organizers can create experiences.
        canCreateExperience: role === 'Organizer' || role === 'Admin',

        // Only Guides can manage their guide profile.
        canManageGuideProfile: role === 'Guide' || role === 'Admin',

        // --- Auth state ---
        isLoggedIn: !!user,
        role,
        user,
    };
};

export default usePermissions;
