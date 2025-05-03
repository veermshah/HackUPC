"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

type ActivityLevel = "Low" | "Medium" | "High";

interface TripFormData {
    name: string;
    budget: string;
    activityLevel: ActivityLevel | "";
    interests: string[];
    travelDates: string;
    climate: string;
    maxTravelTime: string;
    travelMode: string;
    dietaryNeeds: string;
    passportRequired: boolean;
    groupSize: string;
    environmentalConcern: string;
    otherRequirements: string;
}

export default function TripForm() {
    const router = useRouter();
    const [form, setForm] = useState<TripFormData>({
        name: "",
        budget: "",
        activityLevel: "",
        interests: [],
        travelDates: "",
        climate: "",
        maxTravelTime: "",
        travelMode: "",
        dietaryNeeds: "",
        passportRequired: false,
        groupSize: "",
        environmentalConcern: "",
        otherRequirements: "",
    });

    const interestsList = [
        "Beach",
        "Mountains",
        "City",
        "Adventure",
        "Culture",
        "Relaxation",
    ];

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleInterestChange = (interest: string) => {
        setForm((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <main
            className="min-h-screen bg-cover bg-center "
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="h-8"></div>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    p: 4,
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    boxShadow: 3,
                }}
            >
                <button
                    onClick={() => router.push("/")}
                    className="text-black cursor-pointer hover:scale-110 active:scale-95 duration-75 text-xl items-center flex mb-2"
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back
                    </span>
                </button>
                <TextField
                    label="Budget (USD)"
                    name="budget"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={form.budget}
                    onChange={handleChange}
                    required
                />

                <TextField
                    label="Number of Travelers"
                    name="groupSize"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={form.groupSize}
                    onChange={handleChange}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="activity-level-label">
                        Activity Level
                    </InputLabel>
                    <Select
                        labelId="activity-level-label"
                        name="activityLevel"
                        value={form.activityLevel}
                        label="Activity Level"
                        onChange={handleSelectChange}
                        required
                    >
                        <MenuItem value="Low">Low (Relaxed)</MenuItem>
                        <MenuItem value="Medium">Medium (Balanced)</MenuItem>
                        <MenuItem value="High">High (Active)</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    className="text-black"
                    component="fieldset"
                    margin="normal"
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Interests
                    </Typography>
                    <FormGroup row>
                        {interestsList.map((interest) => (
                            <FormControlLabel
                                key={interest}
                                control={
                                    <Checkbox
                                        checked={form.interests.includes(
                                            interest
                                        )}
                                        onChange={() =>
                                            handleInterestChange(interest)
                                        }
                                    />
                                }
                                label={interest}
                            />
                        ))}
                    </FormGroup>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Preferred Climate</InputLabel>
                    <Select
                        name="climate"
                        value={form.climate}
                        label="Preferred Climate"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="Warm">Warm</MenuItem>
                        <MenuItem value="Cold">Cold</MenuItem>
                        <MenuItem value="Mild">Mild</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Max Travel Time (hours)"
                    name="maxTravelTime"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={form.maxTravelTime}
                    onChange={handleChange}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Preferred Travel Mode</InputLabel>
                    <Select
                        name="travelMode"
                        value={form.travelMode}
                        label="Preferred Travel Mode"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="Flight">Flight</MenuItem>
                        <MenuItem value="Train">Train</MenuItem>
                        <MenuItem value="Car">Car</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Dietary Needs (optional)"
                    name="dietaryNeeds"
                    fullWidth
                    margin="normal"
                    value={form.dietaryNeeds}
                    onChange={handleChange}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.passportRequired}
                            onChange={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    passportRequired: !prev.passportRequired,
                                }))
                            }
                        />
                    }
                    label="I have a valid passport"
                />

                <TextField
                    label="Preferred Travel Dates"
                    name="travelDates"
                    fullWidth
                    margin="normal"
                    value={form.travelDates}
                    onChange={handleChange}
                    placeholder="e.g., June 10 - June 15"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Environmental Concern</InputLabel>
                    <Select
                        name="environmentalConcern"
                        value={form.environmentalConcern}
                        label="Environmental Concern"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="Not Important">Not Important</MenuItem>
                        <MenuItem value="Somewhat Important">
                            Somewhat Important
                        </MenuItem>
                        <MenuItem value="Very Important">
                            Very Important
                        </MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Any other requirements?"
                    name="otherRequirements"
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    value={form.otherRequirements}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="px-4 py-2 w-full my-5 bg-[#0f3857] text-white hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75"
                >
                    Submit Preferences
                </button>
            </Box>
            <div className="h-8"></div>
        </main>
    );
}
