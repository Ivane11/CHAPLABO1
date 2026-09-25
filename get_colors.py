import sys
from PIL import Image

def get_dominant_colors(image_path, num_colors=10):
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        img = img.resize((100, 100)) # resize for speed
        colors = img.getcolors(10000)
        colors.sort(key=lambda x: x[0], reverse=True)
        print("Dominant colors (count, RGB):")
        for count, color in colors[:num_colors]:
            hex_color = "#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2])
            print(f"{hex_color} - Count: {count} - RGB: {color}")
    except Exception as e:
        print("Error:", e)

get_dominant_colors("/Users/ivane/.gemini/antigravity-ide/brain/e9b3f693-da3e-4898-91c7-5e0ca9022f9b/.user_uploaded/media_1790174871999.jpg")
