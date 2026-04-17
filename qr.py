import qrcode

# Website URL
data = "https://www.thasan.org"

# Create QR code
img = qrcode.make(data)

# Save QR code image
img.save("thasan_qr.png")

print("QR Code generated and saved as thasan_qr.png")