#!/bin/bash

# Create the images directory if it doesn't exist
mkdir -p assets/images/animals

# Function to download an image
download_image() {
    local url=$1
    local filename=$2
    echo "Downloading $filename..."
    curl -L "$url" -o "assets/images/animals/$filename"
}

# Download all images
download_image "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46" "elephant.jpg"
download_image "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60" "lion.jpg"
download_image "https://images.unsplash.com/photo-1598439210625-5067c578f3f6" "penguin.jpg"
download_image "https://images.unsplash.com/photo-1579547944064-0180251f94c8" "chameleon.jpg"
download_image "https://images.unsplash.com/photo-1607153333879-c174d265f1d2" "dolphin.jpg"
download_image "https://images.unsplash.com/photo-1547721064-da6cfb341d50" "giraffe.jpg"
download_image "https://images.unsplash.com/photo-1551189014-fe516aed0e9e" "frog.jpg"
download_image "https://images.unsplash.com/photo-1552728089-57bdde30beb3" "parrot.jpg"
download_image "https://images.unsplash.com/photo-1549480017-d76466a4b7e8" "tiger.jpg"
download_image "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10" "octopus.jpg"
download_image "https://images.unsplash.com/photo-1579573183265-27e3e834d81e" "koala.jpg"
download_image "https://images.unsplash.com/photo-1578326457399-3b34dbbf23b8" "kangaroo.jpg"
download_image "https://images.unsplash.com/photo-1624007435086-1c985ad88ad7" "butterfly.jpg"
download_image "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7" "panda.jpg"
download_image "https://images.unsplash.com/photo-1560275619-4662e36fa65c" "shark.jpg"
download_image "https://images.pexels.com/photos/86596/owl-bird-eyes-eagle-owl-86596.jpeg" "owl.jpg"
download_image "https://images.unsplash.com/photo-1558674378-e4334d4fecc2" "bee.jpg"
download_image "https://images.unsplash.com/photo-1583507171283-0d663f8416c8" "flamingo.jpg"
download_image "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91" "sloth.jpg"
download_image "https://images.unsplash.com/photo-1589656966895-2f33e7653819" "polar-bear.jpg"
download_image "https://images.unsplash.com/photo-1511823794984-b87716139b88" "peacock.jpg"
download_image "https://images.unsplash.com/photo-1589652717521-10c0d092dea9" "platypus.jpg"
download_image "https://images.unsplash.com/photo-1583212292454-1fe6229603b7" "seahorse.jpg"
download_image "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d" "axolotl.jpg"
download_image "https://images.unsplash.com/photo-1497752531616-c3afd9760a11" "raccoon.jpg"
download_image "https://images.unsplash.com/photo-1591389246146-8f5dd7612539" "hummingbird.jpg"
download_image "https://images.unsplash.com/photo-1577493340887-b7bfff550145" "komodo-dragon.jpg"
download_image "https://images.unsplash.com/photo-1631867675167-90a456a90863" "jellyfish.jpg"
download_image "https://images.pexels.com/photos/63084/pexels-photo-63084.jpeg" "praying-mantis.jpg"
download_image "https://images.unsplash.com/photo-1538439907460-1596cafd4eff" "red-eyed-tree-frog.jpg"
download_image "https://images.unsplash.com/photo-1533850595620-7b1711221751" "monarch-butterfly.jpg"
download_image "https://images.unsplash.com/photo-1547387799-c95f0120c3c5" "manta-ray.jpg"
download_image "https://images.unsplash.com/photo-1550853024-fae8cd4be47f" "toucan.jpg"

# Download failed images with alternative sources
download_image "https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg" "koala.jpg"
download_image "https://images.pexels.com/photos/672142/pexels-photo-672142.jpeg" "butterfly.jpg"
download_image "https://images.pexels.com/photos/53977/eagle-owl-owl-bird-of-prey-53977.jpeg" "owl.jpg"
download_image "https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg" "hummingbird.jpg"
download_image "https://images.pexels.com/photos/87452/flowers-background-butterflies-beautiful-87452.jpeg" "praying-mantis.jpg"
download_image "https://images.pexels.com/photos/3370153/pexels-photo-3370153.jpeg" "manta-ray.jpg"

echo "All images downloaded!" 