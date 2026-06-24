import os
from PIL import Image

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

for img_name in images:
    img_path = os.path.join(base_dir, img_name)
    if not os.path.exists(img_path):
        print(f"Skipping {img_path} - not found")
        continue
        
    print(f"Processing {img_name}...")
    
    backup_path = img_path + ".bak"
    if not os.path.exists(backup_path):
        import shutil
        shutil.copy(img_path, backup_path)
        
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        alpha = max(r, g, b)
        if alpha == 0:
            new_data.append((0, 0, 0, 0))
        else:
            new_r = min(255, int((r * 255) / alpha))
            new_g = min(255, int((g * 255) / alpha))
            new_b = min(255, int((b * 255) / alpha))
            new_data.append((new_r, new_g, new_b, alpha))
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print(f"Saved {img_name}")

print("Done")
