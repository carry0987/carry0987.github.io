#!/bin/bash

set -e

wget https://raw.github.com/carry0987/Raspberry-Pi-Repo/master/Setup/Install-Main-Pkg.sh
wget https://raw.github.com/carry0987/Raspberry-Pi-Repo/master/Tools/tools.sh
wget https://raw.github.com/carry0987/Raspberry-Pi-Repo/master/Rclone-Mount/rclone-mount.sh
wget https://raw.github.com/carry0987/Raspberry-Pi-Repo/master/Rclone-Mount/delete-rclone-mount.sh

rm set.sh

exit 0
