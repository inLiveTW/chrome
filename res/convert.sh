#
# (OS X)
#
# What is this?
#
# It's a shell script that is using sips to create all the icon files from one source icon.
#
# Stick the script in your 'www/res/icons' folder with your source icon 'my-hires-icon.png' then trigger it from Terminal.
#

ICON=${1:-"logo.png"}

ANDROID_ICON='../../platforms/android/res/'

sips $ICON -Z 96 -o $ANDROID_ICON'drawable/icon.png'

sips $ICON -Z 36 -o $ANDROID_ICON'drawable-ldpi/icon.png'
sips $ICON -Z 48 -o $ANDROID_ICON'drawable-mdpi/icon.png'
sips $ICON -Z 72 -o $ANDROID_ICON'drawable-hdpi/icon.png'
sips $ICON -Z 96 -o $ANDROID_ICON'drawable-xhdpi/icon.png'

IOS_ICON='../../platforms/ios/LiveTW/Resources/icons/'

sips $ICON -Z 57 -o $IOS_ICON'icon.png'
sips $ICON -Z 114 -o $IOS_ICON'icon@2x.png'

sips $ICON -Z 29 -o $IOS_ICON'icon-small.png'
sips $ICON -Z 58 -o $IOS_ICON'icon-small@2x.png'

sips $ICON -Z 40 -o $IOS_ICON'icon-40.png'
sips $ICON -Z 80 -o $IOS_ICON'icon-40@2x.png'

sips $ICON -Z 50 -o $IOS_ICON'icon-50.png'
sips $ICON -Z 100 -o $IOS_ICON'icon-50@2x.png'

sips $ICON -Z 57 -o $IOS_ICON'icon-57.png'
sips $ICON -Z 114 -o $IOS_ICON'icon-57@2x.png'

sips $ICON -Z 60 -o $IOS_ICON'icon-60.png'
sips $ICON -Z 120 -o $IOS_ICON'icon-60@2x.png'

sips $ICON -Z 72 -o $IOS_ICON'icon-72.png'
sips $ICON -Z 144 -o $IOS_ICON'icon-72@2x.png'

sips $ICON -Z 76 -o $IOS_ICON'icon-76.png'
sips $ICON -Z 152 -o $IOS_ICON'icon-76@2x.png'
