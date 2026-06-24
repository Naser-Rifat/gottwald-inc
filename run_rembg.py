import os
from PIL import Image

try:
    from rembg import remove
    from rembg import new_session
except ImportError:
    import sys
    sys.path.append(os.path.expanduser('~/.local/lib/python3.9/site-packages'))
    sys.path.append(os.path.expanduser('~/Library/Python/3.9/lib/python/site-packages'))
    from rembg import remove
    from rembg import new_session

images = [
    "coaching-mentoring.png",
    "consulting.png",
    "it-solutions-2030.png",
    "marketing-communication.png",
    "plhhcoin_new.png",
    "relocation-structure-deployment.png",
    "solutionfinder-solution-management.png"
]

base_dir = "public/images/pillars"

# Initialize session once for speed
session = new_session()

for img_name in images:
    img_path = os.path.join(base_dir, img_name)
    if not os.path.exists(img_path):
        print(f"Skipping {img_name}")
        continue
    
    print(f"Processing {img_name}...")
    
    try:
        # Load image
        input_image = Image.open(img_path)
        
        # Remove background with alpha matting for better glowing edges
        output_image = remove(
            input_image, 
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        
        # Save output
        output_image.save(img_path)
        print(f"Saved {img_name}")
    except Exception as e:
        print(f"Error processing {img_name}: {e}")

print("Done")
