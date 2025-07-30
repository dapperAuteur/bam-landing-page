# How to Add New Experiences

This system makes it super easy to add new work experiences, projects, and skills. Here's how:

## Adding a New Experience

1. Open `lib/experienceData.ts`
2. Find the `experiences` array
3. Copy the format of an existing experience
4. Update these fields:
   - `id`: Next highest number (if last one is 5, use 6)
   - `title`: Your job title
   - `company`: Company name
   - `period`: Time period (e.g., "2024-Present")
   - `type`: Category like "Developer Relations", "Technical Education", etc.
   - `description`: Brief description of the role
   - `achievements`: Array of bullet points about what you accomplished
   - `technologies`: Array of technologies/skills you used
   - `featured`: Set to `true` if you want it highlighted with special styling

## Adding a New Project

1. In the same file, find the `projects` array
2. Copy an existing project format
3. Update all the fields
4. Add a `link` if you want to link to the project
5. Set `featured: true` for important projects

## Adding New Skills

1. Find the `skillCategories` array
2. Either add skills to existing categories or create a new category
3. Follow the same format

## Example: Adding a New Experience

```typescript
{
  id: 6, // Next number
  title: "Senior Developer Advocate",
  company: "Amazing Tech Company",
  period: "2024-Present",
  type: "Developer Relations",
  description: "Leading developer advocacy for cutting-edge AI tools.",
  achievements: [
    "Increased developer adoption by 300%",
    "Created viral technical content reaching 50K+ developers",
    "Built thriving community of 1000+ active members"
  ],
  technologies: ["AI/ML", "Python", "Community Building", "Content Creation"],
  featured: true // This will highlight it
}
```

## That's It!

Just save the file and your new experience will automatically appear on the website with proper styling and formatting. No need to touch any other files!

The system automatically:
- ✅ Displays experiences in timeline format
- ✅ Highlights featured items with special styling
- ✅ Shows technologies as tags
- ✅ Creates hover effects and responsive design
- ✅ Maintains consistent formatting