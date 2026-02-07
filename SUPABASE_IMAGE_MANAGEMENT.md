# Supabase Image Management Guide

## Overview

This guide covers best practices for managing car images in your Prosperous Motors dealership application using Supabase.

## Current Architecture

### Database Structure

Images are stored as **URL arrays** in the `cars` table:

```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  images TEXT[] NOT NULL,  -- Array of image URLs
  -- ... other fields
);
```

### Image Storage Options

You have two approaches:

### Option 1: External Image URLs (Current Implementation)
**Best for:** Quick setup, images hosted on CDN like Unsplash, Cloudinary, or your own server

**Pros:**
- No database storage limits
- Easy to switch hosts
- Supports any web host
- Costs less initially

**Cons:**
- Depends on external service uptime
- Slower image loading
- Need to manage multiple hosts

### Option 2: Supabase Storage (Recommended for Production)
**Best for:** Complete control, branded images, long-term solution

**Pros:**
- Full integration with Supabase
- 100GB free storage
- Automatic CDN delivery
- Easy access control via RLS

**Cons:**
- Slight performance overhead on first request
- Requires storage bucket setup

## Option 1: Using External Image URLs

### URL Validation Best Practices

**Required Validation (Implemented):**

```typescript
const addImageUrl = () => {
  const url = newImageUrl.trim();
  
  // 1. Not empty
  if (!url) {
    toast.error('Please enter an image URL');
    return;
  }
  
  // 2. Valid protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    toast.error('Image URL must start with http:// or https://');
    return;
  }
  
  // 3. No duplicates
  if (imageUrls.includes(url)) {
    toast.error('This image URL is already added');
    return;
  }
  
  // 4. Add URL
  setImageUrls([...imageUrls, url]);
  setNewImageUrl('');
  toast.success('Image URL added');
};
```

### Testing Image URLs Before Adding

**Manual Testing:**
1. Copy image URL into address bar
2. Verify image loads in browser
3. Check image is appropriate size (not too large)
4. Copy URL and paste into admin form

**Recommended CDN Services:**

1. **Unsplash** (Free)
   - Format: `https://unsplash.com/photos/{id}`
   - Example: `https://unsplash.com/photos/Mv9hjg1Hc1w`

2. **Cloudinary** (Free tier 5GB)
   - Upload images, get optimized URLs
   - Automatic compression
   - Responsive image support

3. **Pexels** (Free)
   - Format: `https://www.pexels.com/photo/{id}`

4. **Your Own Server**
   - Full control
   - Best performance
   - Example: `https://images.prospermotors.com/cars/car-001.jpg`

### Image Size Optimization

**Recommended Specifications:**

```
Resolution:  1920x1440 pixels or higher
Format:      JPG, WebP, or PNG
Quality:     85% compression
File Size:   150KB - 500KB per image
Aspect Ratio: 4:3 (landscape)
```

**Optimization Tools:**
- TinyJPG (tinyjpg.com) - Compress JPG/PNG
- ImageOptim (imageoptim.com) - Batch compression
- Cloudinary - Automatic optimization

### Error Handling for Failed Images

**Current Implementation in Shop.tsx:**

```typescript
const handleImageLoad = (url: string) => {
  // Remove from failed set
  setImageLoadErrors(prev => {
    const newSet = new Set(prev);
    newSet.delete(url);
    return newSet;
  });
};

const handleImageError = (url: string) => {
  console.error('[Shop] Image failed to load:', url);
  setImageLoadErrors(prev => new Set(prev).add(url));
};

// In JSX:
{imageLoadErrors.has(image) ? (
  <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
    <AlertCircle className="w-8 h-8 text-gray-600" />
  </div>
) : (
  <img
    src={image}
    alt="Car"
    onLoad={() => handleImageLoad(image)}
    onError={() => handleImageError(image)}
    className="w-full h-full object-cover rounded-lg"
  />
)}
```

## Option 2: Using Supabase Storage (Production-Ready)

### Setup Steps

#### Step 1: Enable Storage in Supabase Dashboard

1. Go to: https://app.supabase.com/project/YOUR_PROJECT/storage/buckets
2. Click "New bucket"
3. Name: `car-images`
4. Privacy: **Public** (so URLs are accessible)
5. Click "Create bucket"

#### Step 2: Set RLS Policy

Storage buckets use RLS policies:

```sql
-- Allow anyone to view images (public read)
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

-- Allow only admins to upload images
CREATE POLICY "Admin Upload"
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
  -- Add more checks based on your auth setup
);

-- Allow only admins to delete images
CREATE POLICY "Admin Delete"
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);
```

#### Step 3: Update Upload Code

```typescript
import { supabase } from '@/integrations/supabase/client';

const uploadImage = async (file: File) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName);

    console.log('Upload successful:', publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

#### Step 4: Update Image URLs in Database

Replace text input with file upload:

```typescript
// Instead of text input for URLs:
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setIsUploading(true);
    const url = await uploadImage(file);
    setImageUrls([...imageUrls, url]);
    setIsUploading(false);
    toast.success('Image uploaded successfully');
  } catch (error) {
    toast.error('Failed to upload image');
  }
};
```

### Supabase Storage URLs Format

```
https://{PROJECT_ID}.supabase.co/storage/v1/object/public/car-images/{fileName}
```

Example:
```
https://abc123.supabase.co/storage/v1/object/public/car-images/1706969142345-car.jpg
```

## Troubleshooting

### Problem: Images Show Error Icon

**Causes & Solutions:**

1. **Invalid URL Format**
   - ❌ `car.jpg` (missing protocol)
   - ❌ `htp://example.com/car.jpg` (typo)
   - ✅ `https://example.com/car.jpg`

2. **Image Server Down**
   - Check if URL works in new browser tab
   - Use different image host if original is slow
   - Add timeout fallback

3. **CORS Issues**
   - Error appears when external image can't load
   - Solution: Use CORS-enabled hosting (Unsplash, Cloudinary, Supabase)

### Problem: Images Not Saving to Database

**Causes & Solutions:**

1. **Check Supabase Connection**
   - Visit `/diagnostics` page
   - Verify "Supabase Connected" shows green
   - Check console for connection errors

2. **Check RLS Policies**
   - Ensure your Supabase role has INSERT permission on `cars.images`
   - Visit Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM cars LIMIT 1;`

3. **Check Network Requests**
   - Open Browser DevTools → Network tab
   - Look for failed requests to `supabase.co`
   - Check response status and error message

### Problem: Slow Image Loading

**Solutions:**

1. **Use Smaller Images**
   - Compress images to < 300KB
   - Use WebP format instead of PNG
   - Reduce resolution to 1920x1440

2. **Use CDN with Caching**
   - Cloudinary (free tier)
   - Bunny CDN (cheap)
   - AWS CloudFront

3. **Enable Lazy Loading**
   - Already implemented: `loading="lazy"` on images
   - Images load only when visible

4. **Use Next-Gen Formats**
   ```html
   <picture>
     <source srcset="car.webp" type="image/webp" />
     <source srcset="car.jpg" type="image/jpeg" />
     <img src="car.jpg" alt="Car" />
   </picture>
   ```

## Performance Tips

### 1. Image Dimensions
Always specify width/height to prevent layout shift:

```tsx
<img
  src={imageUrl}
  alt="Car"
  width={1920}
  height={1440}
  className="w-full h-full object-cover"
/>
```

### 2. Responsive Images
Serve different sizes for different devices:

```tsx
<img
  src={imageUrl}
  srcSet={`
    ${imageUrl}?w=400 400w,
    ${imageUrl}?w=800 800w,
    ${imageUrl}?w=1200 1200w
  `}
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Car"
/>
```

### 3. Batch Loading
Don't load all images at once:

```typescript
const IMAGES_PER_PAGE = 6;

useEffect(() => {
  const loadMoreImages = () => {
    setLoadedCount(prev => prev + IMAGES_PER_PAGE);
  };
  
  window.addEventListener('scroll', loadMoreImages);
  return () => window.removeEventListener('scroll', loadMoreImages);
}, []);
```

## Migration from URLs to Storage

If switching from external URLs to Supabase Storage:

```typescript
// 1. Download all external images
// 2. Upload to Supabase storage bucket
// 3. Update database with new URLs
// 4. Verify all images load
// 5. Delete external images

const migrateImages = async (cars: Car[]) => {
  for (const car of cars) {
    const newImages = [];
    
    for (const imageUrl of car.images) {
      try {
        // Download image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `car-${car.id}-${Date.now()}.jpg`);
        
        // Upload to Supabase
        const newUrl = await uploadImage(file);
        newImages.push(newUrl);
      } catch (error) {
        console.error('Migration error:', error);
      }
    }
    
    // Update database
    await supabase
      .from('cars')
      .update({ images: newImages })
      .eq('id', car.id);
  }
};
```

## Security Considerations

### Public vs Private Images

```typescript
// Public images (anyone can view)
const publicUrl = supabase.storage
  .from('car-images')
  .getPublicUrl(fileName).data.publicUrl;

// Private images (only authenticated users)
const { data: privateUrl } = await supabase.storage
  .from('car-images')
  .createSignedUrl(fileName, 3600); // 1 hour expiry
```

### Preventing Hot-linking

Use image hosting with anti-hotlink protection:
- Cloudinary
- Imgix
- Custom server with referer check

### Validate Image Content

```typescript
const isValidImage = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
};
```

## Summary

- ✅ **Current Setup**: External URLs with validation
- ✅ **Error Handling**: Broken images show fallback
- ✅ **Validation**: Checks protocol, duplicates, format
- 🎯 **Next Step**: Consider migrating to Supabase Storage for production
- 📊 **Monitoring**: Check `/diagnostics` page for connection issues
