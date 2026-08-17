import urllib.request
import os
import time

BASE = "https://dfande.com/wp-content/uploads/"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
DEST_ROOT = r"c:\Users\Kay Freeman\Documents\Jameson\DFANDE\Frontend\src\assets\site"

FILES = {
    # client logos
    "logos-clients": [
        "2018/11/Chevron.png", "2018/11/Shell_logo.png", "2018/11/ExxonMobil.png",
        "2018/11/Total.png", "2018/11/aDDAX.png", "2018/11/Eni_logo.png",
        "2018/11/NPDC.png", "2018/11/Seepco_logo.png", "2018/11/AFREN.png",
        "2018/11/Daewoo_Nigeria.png", "2018/11/Pacific_Drilling.png", "2018/11/Seadrill.png",
    ],
    # partner / OEM logos
    "logos-partners": [
        "2018/11/Ameriforce.png", "2018/11/FMC_Tech.png", "2018/11/GE.png",
        "2018/11/Masterflo.png", "2018/11/National_Oilwell_VARCO.png",
        "2018/11/SCV.png", "2018/11/Waetherford.png",
    ],
    # certificates (PDFs)
    "certificates": [
        "2026/03/DIVINE-FLAME-AND-ENERGY-INTERNATIONAL-LTD-14001-CERTIFICATE-APPROVED.pdf",
        "2026/03/DIVINE-FLAME-AND-ENERGY-INTERNATIONAL-LTD-45001-CERTIFICATE-APPROVED-1.pdf",
        "2026/03/DIVINE-FLAME-AND-ENERGY-INTERNATIONAL-LTD-9001-CERTIFICATE-APPROVED.pdf",
        "2023/05/divine-flame-and-energy-international-limited-5.pdf",
        "2023/05/divine-flame-and-energy-international-limited-7.pdf",
        "2023/05/divine-flame-and-energy-international-limited-8.pdf",
    ],
    # Agbami subsea choke refurbishment case study
    "projects/agbami": [
        "2019/02/2-283x376.jpeg", "2019/02/A-283x376.png", "2019/02/Agba1-1-283x376.png",
        "2019/02/Agba2-283x376.png", "2019/02/Agba3-283x376.png", "2019/02/Agba4-1-283x376.png",
        "2019/02/B-283x376.png", "2019/02/C-283x376.png",
        "2019/02/IMG_20181031_143310-283x376.jpg", "2019/02/IMG_20181031_143321-283x376.jpg",
        "2019/02/IMG_20181031_143341-283x376.jpg", "2019/02/IMG_20181101_123328-283x376.jpg",
        "2019/02/IMG_20181101_123334-283x376.jpg", "2019/02/IMG_20181101_123356-283x376.jpg",
        "2019/02/IMG_20181101_131713-283x376.jpg", "2019/02/IMG_20181101_131736-283x376.jpg",
        "2019/02/IMG_20181101_131748-283x376.jpg", "2019/02/IMG_20181102_110722-283x376.jpg",
        "2019/02/IMG_20181102_110735-283x376.jpg", "2019/02/IMG_20181102_110813-283x376.jpg",
        "2019/02/IMG_20181102_110827-283x376.jpg", "2019/02/IMG_20181102_120949-283x376.jpg",
        "2019/02/IMG_20181102_125713-283x376.jpg", "2019/02/IMG_20181102_125726-283x376.jpg",
        "2019/02/Agbami_Refurb_Banner.png",
    ],
    "projects/local-wellhead": [
        "2019/02/1-282x212.png", "2019/02/2-282x212.png", "2019/02/3-282x212.png",
        "2019/02/4-282x212.png", "2019/02/5-282x212.png", "2019/02/6-282x212.png",
        "2019/02/8-282x212.png", "2019/02/9-282x212.png", "2019/02/local_wellhead_equip.png",
    ],
    "projects/surface-choke": [
        "2019/04/1-283x376.png", "2019/04/2-283x376.png", "2019/04/3-283x376.png",
        "2019/04/4-283x376.png", "2019/04/5-283x376.png", "2019/04/6-283x376.png",
        "2019/04/7-283x376.png", "2019/04/8-283x376.png",
    ],
    "banners": [
        "2018/11/logo_DFandE.jpg", "2018/11/banner_edge.png", "2018/11/banner_side.png",
        "2019/01/services_banner.png", "2019/01/Contact_Us_Page.png",
        "2019/01/Valves_Banner_1.png", "2019/01/xmas_tree_banner_1.png",
        "2019/02/Flow_Meter.png", "2019/02/Wellhead_Xmas_Tree_NCEC.png",
        "2019/02/Actuators_NCEC.png", "2019/02/valves.png",
    ],
    "services": [
        "2019/02/Drillig_Support_DFandE.png", "2019/02/EPC_DFandE.png",
        "2019/02/Fishing_and_renetry_DFandE-e1678205124986.png",
        "2019/02/OCTG_DandE.png", "2019/02/Valves_DFandE-e1678205173792.png",
        "2019/02/Wellhead_services_DFandE.png",
        "2019/01/wellhead_xmas_tree.png", "2019/01/choke_valve.png",
        "2019/01/Main_EPC.png", "2019/01/Drilling_Main.png",
        "2019/01/mAIN_fishing_re_entry.png", "2019/01/wellhead.png",
    ],
}

req_headers = {"User-Agent": UA, "Referer": "https://dfande.com/"}

ok, fail = 0, 0
for folder, paths in FILES.items():
    dest_dir = os.path.join(DEST_ROOT, folder)
    os.makedirs(dest_dir, exist_ok=True)
    for p in paths:
        fname = p.split("/")[-1]
        url = BASE + p
        dest = os.path.join(dest_dir, fname)
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=20) as resp, open(dest, "wb") as f:
                f.write(resp.read())
            ok += 1
        except Exception as e:
            fail += 1
            print("FAIL", url, "->", e)
        time.sleep(0.05)

print(f"Done. ok={ok} fail={fail}")
