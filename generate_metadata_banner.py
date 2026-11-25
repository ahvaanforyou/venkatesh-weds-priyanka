import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

def generate_banners():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(base_dir, 'assets')
    font_dir = 'C:/Windows/Fonts'

    width = 1200
    height = 630

    # Typography
    f_shloka = ImageFont.truetype(os.path.join(font_dir, 'georgia.ttf'), 15)
    f_title = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 19)
    f_name_big = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 36)
    f_weds = ImageFont.truetype(os.path.join(font_dir, 'georgiai.ttf'), 22)
    f_date = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 21)
    f_time = ImageFont.truetype(os.path.join(font_dir, 'georgia.ttf'), 16)
    f_venue_bold = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 15)
    f_venue = ImageFont.truetype(os.path.join(font_dir, 'georgiai.ttf'), 14)
    f_btn = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 14)
    f_card_name = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 16)
    f_card_role = ImageFont.truetype(os.path.join(font_dir, 'georgiai.ttf'), 13)

    # Royal Navy Blue & Gold Palette
    bg_color = (12, 28, 64)       # Solid plain luxury royal navy
    gold = (212, 175, 55)         # Classic Gold
    bright_gold = (255, 223, 110) # Bright Gold
    deep_gold = (180, 140, 35)    # Deep Gold
    card_bg = (7, 18, 42)         # Deep contrast card background

    base = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(base)

    # Double Gold Borders
    draw.rectangle([18, 18, width - 18, height - 18], outline=gold, width=2)
    draw.rectangle([24, 24, width - 24, height - 24], outline=deep_gold, width=1)
    for cx, cy in [(21, 21), (width - 21, 21), (21, height - 21), (width - 21, height - 21)]:
        draw.rectangle([cx - 4, cy - 4, cx + 4, cy + 4], fill=bright_gold)

    # Left Column: Couple Portrait Cards
    card_w = 200
    card_h = 450
    card_y = 90

    def draw_card(img_path, name, role, x, y):
        c_img = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
        c_draw = ImageDraw.Draw(c_img)
        c_draw.rounded_rectangle([0, 0, card_w, card_h], radius=16, fill=(*card_bg, 255), outline=gold, width=2)
        c_draw.rounded_rectangle([3, 3, card_w - 3, card_h - 3], radius=14, outline=deep_gold, width=1)

        photo_w = card_w - 14
        photo_h = card_h - 76
        if os.path.exists(img_path):
            raw = Image.open(img_path).convert('RGB')
            target_ratio = photo_w / photo_h
            raw_w, raw_h = raw.size
            raw_ratio = raw_w / raw_h
            if raw_ratio > target_ratio:
                new_w = int(raw_h * target_ratio)
                left = (raw_w - new_w) // 2
                raw = raw.crop((left, 0, left + new_w, raw_h))
            else:
                new_h = int(raw_w / target_ratio)
                top = max(0, int((raw_h - new_h) * 0.15))
                raw = raw.crop((0, top, raw_w, top + new_h))
            enhancer = ImageEnhance.Sharpness(raw)
            sharp = enhancer.enhance(1.15)
            scaled = sharp.resize((photo_w, photo_h), Image.Resampling.LANCZOS)
            mask = Image.new('L', (photo_w, photo_h), 0)
            m_draw = ImageDraw.Draw(mask)
            m_draw.rounded_rectangle([0, 0, photo_w, photo_h], radius=12, fill=255)
            c_img.paste(scaled, (7, 7), mask)
            c_draw.rounded_rectangle([7, 7, card_w - 7, photo_h], radius=12, outline=deep_gold, width=1)

        bbox_n = c_draw.textbbox((0, 0), name, font=f_card_name)
        nw = bbox_n[2] - bbox_n[0]
        c_draw.text(((card_w - nw) // 2 + 1, photo_h + 13), name, fill=(0, 0, 0), font=f_card_name)
        c_draw.text(((card_w - nw) // 2, photo_h + 12), name, fill=(255, 245, 210), font=f_card_name)

        bbox_r = c_draw.textbbox((0, 0), role, font=f_card_role)
        rw = bbox_r[2] - bbox_r[0]
        c_draw.text(((card_w - rw) // 2, photo_h + 34), role, fill=bright_gold, font=f_card_role)

        base.paste(c_img, (x, y), c_img)

    draw_card(os.path.join(assets_dir, 'venkatesh-groom-portrait.jpg'), 'Venkatesh', 'The Groom', 44, card_y)
    draw_card(os.path.join(assets_dir, 'priyanka-bride-portrait.jpg'), 'Devi Priyanka', 'The Bride', 260, card_y)

    # Right Content Area
    content_left = 480
    content_right = width - 40
    center_x = (content_left + content_right) // 2

    def draw_c(text, y, font, fill):
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        draw.text((center_x - w // 2, y), text, font=font, fill=fill)
        return bbox[3] - bbox[1]

    draw_c('||  SRIRASTHU · SHUBHAMASTHU · AVIGHNAMASTHU  ||', 60, f_shloka, (255, 230, 140))
    draw_c('WEDDING CELEBRATION INVITATION', 88, f_title, bright_gold)

    draw.line([(center_x - 170, 118), (center_x + 170, 118)], fill=gold, width=1)
    draw.polygon([(center_x, 114), (center_x + 4, 118), (center_x, 122), (center_x - 4, 118)], fill=bright_gold)

    # Stacked Names
    draw_c('Venkatesh', 134, f_name_big, (255, 255, 255))
    draw_c('—  weds  —', 180, f_weds, bright_gold)
    draw_c('Devi Priyanka', 212, f_name_big, (255, 255, 255))

    draw.line([(center_x - 140, 268), (center_x + 140, 268)], fill=deep_gold, width=1)

    draw_c('12th December 2026', 290, f_date, bright_gold)
    draw_c('Sumuhurtham: Saturday, 12 Dec 2026 at 8:32 PM', 328, f_time, (245, 240, 225))
    draw_c('Sri Markandeya Padmashali Kalyanamandapam', 356, f_venue_bold, (255, 230, 140))
    draw_c('GR AC Hall, Mangalagiri', 382, f_venue, (230, 225, 210))

    btn_w = 440
    btn_h = 44
    bx1 = center_x - (btn_w // 2)
    by1 = 432
    draw.rounded_rectangle([bx1, by1, bx1 + btn_w, by1 + btn_h], radius=22, fill=(19, 57, 121), outline=gold, width=2)
    draw.rounded_rectangle([bx1 + 2, by1 + 2, bx1 + btn_w - 2, by1 + btn_h - 2], radius=20, outline=bright_gold, width=1)
    btn_txt = 'TAP TO OPEN INVITATION & RSVP'
    bbox_b = draw.textbbox((0, 0), btn_txt, font=f_btn)
    bw = bbox_b[2] - bbox_b[0]
    bh = bbox_b[3] - bbox_b[1]
    draw.text((center_x - bw // 2, by1 + (btn_h - bh) // 2 - 2), btn_txt, font=f_btn, fill=(255, 255, 255))

    # Wedding Hashtag at bottom
    draw_c('#VenkateshWedsPriyanka', 496, f_time, bright_gold)

    # Save to assets
    banner_path = os.path.join(assets_dir, 'og-wedding-banner.jpg')
    base.save(banner_path, 'JPEG', quality=95, optimize=True)
    banner_v3 = os.path.join(assets_dir, 'og-wedding-banner-v3.jpg')
    base.save(banner_v3, 'JPEG', quality=95, optimize=True)

    print(f'Metadata share image created: {banner_path} ({os.path.getsize(banner_path)/1024:.1f} KB)')

if __name__ == '__main__':
    generate_banners()
