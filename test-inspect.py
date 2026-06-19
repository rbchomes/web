import urllib.request

try:
    print("Fetching http://localhost:8080/index.html...")
    with urllib.request.urlopen("http://localhost:8080/index.html") as response:
        html = response.read().decode('utf-8')
        
    print("HTML Fetched successfully!")
    
    # Check if Cormorant Garamond is in the page
    if "Cormorant Garamond" in html:
        print("[SUCCESS] 'Cormorant Garamond' is in the head.")
    else:
        print("[WARNING] 'Cormorant Garamond' is NOT in the head.")
        
    # Check if luxury-hero is in the page
    if "luxury-hero" in html:
        print("[SUCCESS] 'luxury-hero' class is in the body.")
        # Print a snippet of the hero section
        start_idx = html.find("<!-- Luxury Hero Section -->")
        if start_idx != -1:
            print("Hero section snippet:")
            print(html[start_idx:start_idx+1000])
    else:
        print("[WARNING] 'luxury-hero' class is NOT in the body. Old HTML is being served.")
except Exception as e:
    print("Error fetching page:", e)
