@echo off
"C:\\Program Files\\Java\\jdk-17\\bin\\java" ^
  --class-path ^
  "C:\\Users\\Dorian\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  armeabi-v7a ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  26 ^
  --output ^
  "C:\\Users\\Dorian\\AppData\\Local\\Temp\\agp-prefab-staging2557334226066341006\\staged-cli-output" ^
  "C:\\Users\\Dorian\\.gradle\\caches\\8.10.2\\transforms\\335e806144778f46a943d799acdead8b\\transformed\\react-android-0.76.1-release\\prefab" ^
  "C:\\Users\\Dorian\\.gradle\\caches\\8.10.2\\transforms\\461b16042a3fbc3d5214703f3c2d7ff2\\transformed\\hermes-android-0.76.1-release\\prefab" ^
  "C:\\Users\\Dorian\\.gradle\\caches\\8.10.2\\transforms\\eb4b98dea289284ca2b26e9265bd49ab\\transformed\\fbjni-0.6.0\\prefab"
