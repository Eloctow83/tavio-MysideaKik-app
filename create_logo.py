#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

# Create a 200x200 image with blue background
size = 200
image = Image.new('RGB', (size, size), color='#007bff')
draw = ImageDraw.Draw(image)

# Draw darker blue circle border
border_width = 8
draw.ellipse(
    [border_width//2, border_width//2, size - border_width//2, size - border_width//2],
    outline='#0056b3',
    width=border_width
)

# Draw M text in white
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 120)
except:
    font = ImageFont.load_default()

text = 'M'
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (size - text_width) // 2
y = (size - text_height) // 2 - 10

draw.text((x, y), text, fill='white', font=font)

# Save the image
image.save('Co&Op/logo.png')
print('Logo created: Co&Op/logo.png')
