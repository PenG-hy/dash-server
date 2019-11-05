import sys
import os
import xml.etree.ElementTree as ET
import subprocess

def generate_mpd(videos):
    for video in videos:
        subprocess.run('MP4box -dash 50000 -segment-ext mp4 '+ video, shell=True, check=True)

def merge_mpd(mpds):
    mpds.sort()
    print(mpds)
    dest_tree = ET.parse(mpds.pop())
    periods = []
    for mpd in mpds:
        src_root = ET.parse(mpd).getroot()
        period = src_root.find("{urn:mpeg:dash:schema:mpd:2011}Period")
        periods.append(period)
    dest_root = dest_tree.getroot()
    for i in range(len(periods)):
        dest_root.insert(i+1, periods[i])
    dest_tree.write('manifest.mpd')

    


file_dir = sys.argv[1]
os.chdir(file_dir)
videos = [f for f in os.listdir() if f.endswith('.mp4')]
generate_mpd(videos)
mpds = [mpd for mpd in os.listdir() if mpd.endswith('.mpd')]
merge_mpd(mpds)