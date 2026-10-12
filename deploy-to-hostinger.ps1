<#
  Deploy Kre8tive Minds site to Hostinger via FTP/FTPS.

  HOW TO USE
  ----------
  1. In hPanel -> Files -> FTP Accounts, note your:
       - FTP hostname (e.g. ftp.kre8tiveminds.com  or an IP like 123.45.67.89)
       - FTP username (e.g. u123456789.kre8tiveminds)
       - FTP password
  2. Open PowerShell in this folder and run:
       .\deploy-to-hostinger.ps1
     (If Windows blocks it, first run:
       powershell -ExecutionPolicy Bypass -File .\deploy-to-hostinger.ps1 )
  3. Enter host, username, password when prompted. That's it.

  Notes:
  - Your password is only typed into this local prompt; it is never stored.
  - Try FTPS first (encrypted). If your host doesn't support it, re-run and
    answer 'n' to the FTPS question to use plain FTP.
#>

param(
  [string]$FtpHost   = "",
  [string]$User      = "",
  [string]$RemoteDir = "/public_html",
  [string]$LocalDir  = "$PSScriptRoot\dist"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $LocalDir)) {
  Write-Host "ERROR: Local folder not found: $LocalDir" -ForegroundColor Red
  Write-Host "Make sure you run this from the website project folder (it must contain a 'dist' folder)." -ForegroundColor Yellow
  exit 1
}

if (-not $FtpHost) { $FtpHost = Read-Host "FTP host (e.g. ftp.kre8tiveminds.com or server IP)" }
if (-not $User)    { $User    = Read-Host "FTP username" }
$securePass = Read-Host "FTP password" -AsSecureString
$Password   = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass))

$ftpsAns = Read-Host "Use encrypted FTPS? (Y/n)"
$UseFtps = -not ($ftpsAns -match '^[nN]')

# Normalise host -> ftp://host
$FtpHost = $FtpHost -replace '^ftp://',''  -replace '^ftps://',''  -replace '/+$',''
$RemoteDir = '/' + ($RemoteDir.Trim('/'))

$base = "ftp://$FtpHost"
$cred = New-Object System.Net.NetworkCredential($User, $Password)

function New-FtpRequest([string]$uri, [string]$method) {
  $req = [System.Net.FtpWebRequest]::Create($uri)
  $req.Credentials = $cred
  $req.Method      = $method
  $req.UseBinary   = $true
  $req.UsePassive  = $true
  $req.KeepAlive   = $false
  $req.EnableSsl   = $UseFtps
  return $req
}

function Ensure-RemoteDir([string]$remotePath) {
  # Create directory; ignore "already exists" errors.
  $uri = "$base$remotePath"
  try {
    $req = New-FtpRequest $uri ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
    $resp = $req.GetResponse(); $resp.Close()
    Write-Host "  + created dir $remotePath" -ForegroundColor DarkGray
  } catch [System.Net.WebException] {
    # 550 = already exists -> fine
  }
}

function Upload-File([string]$localFile, [string]$remotePath) {
  $uri = "$base$remotePath"
  $req = New-FtpRequest $uri ([System.Net.WebRequestMethods+Ftp]::UploadFile)
  $bytes = [System.IO.File]::ReadAllBytes($localFile)
  $req.ContentLength = $bytes.Length
  $rs = $req.GetRequestStream()
  $rs.Write($bytes, 0, $bytes.Length)
  $rs.Close()
  $resp = $req.GetResponse(); $resp.Close()
}

Write-Host ""
Write-Host "Deploying '$LocalDir'" -ForegroundColor Cyan
Write-Host "     to  '$base$RemoteDir'  (FTPS: $UseFtps)" -ForegroundColor Cyan
Write-Host ""

# Make sure the base remote dir exists
Ensure-RemoteDir $RemoteDir

$root = (Resolve-Path $LocalDir).Path.TrimEnd('\')

# Create all subdirectories first (shallow -> deep)
Get-ChildItem -Path $root -Recurse -Directory |
  Sort-Object { $_.FullName.Length } |
  ForEach-Object {
    $rel = $_.FullName.Substring($root.Length).Replace('\','/')
    Ensure-RemoteDir "$RemoteDir$rel"
  }

# Upload every file
$files = Get-ChildItem -Path $root -Recurse -File
$total = $files.Count
$i = 0
foreach ($f in $files) {
  $i++
  $rel = $f.FullName.Substring($root.Length).Replace('\','/')
  $remotePath = "$RemoteDir$rel"
  try {
    Upload-File $f.FullName $remotePath
    Write-Host ("[{0,3}/{1}] {2}" -f $i, $total, $rel) -ForegroundColor Green
  } catch {
    Write-Host ("[{0,3}/{1}] FAILED {2}  ->  {3}" -f $i, $total, $rel, $_.Exception.Message) -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Done. Uploaded $total files to $base$RemoteDir" -ForegroundColor Cyan
Write-Host "Now visit https://www.kre8tiveminds.com  (enable free SSL in hPanel -> Security -> SSL if not already on)." -ForegroundColor Cyan
