from PIL import Image
import os

def make_square_favicon(input_path, output_path):
    # Open the original logo
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    width, height = img.size
    max_dim = max(width, height)
    
    # Create a new transparent square image
    new_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    
    # Calculate position to center the logo
    x = (max_dim - width) // 2
    y = (max_dim - height) // 2
    
    # Paste the original logo into the center
    new_img.paste(img, (x, y), img)
    
    # Save the result
    new_img.save(output_path, "PNG")
    print(f"Successfully created square favicon at {output_path}")

input_logo = r"c:\Users\galh2\Documents\GitHub\Shuk-Bashehuna-Wesite\public\logo.png"
output_favicon = r"c:\Users\galh2\Documents\GitHub\Shuk-Bashehuna-Wesite\public\favicon-pure.png"

make_square_favicon(input_logo, output_favicon)
