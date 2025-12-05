export interface UserProfile {
    sport: string;
    frequency: string;
    level: string;
    goals: string[];
    constraints: string[];
    budget: string;
}

export const SPORTS = ["Running", "Fitness", "Yoga", "Cycling", "Swimming", "Hiking"];
export const FREQUENCIES = ["1/week", "2-3/week", "4+/week"];
export const LEVELS = ["Beginner", "Intermediate", "Advanced"];
export const GOALS = ["Lose weight", "Build muscle", "Improve cardio", "Relaxation", "Flexibility"];
export const CONSTRAINTS = ["None", "Knee pain", "Back pain", "Shoulder pain", "Limited time"];
export const BUDGETS = ["Low", "Medium", "High"];
