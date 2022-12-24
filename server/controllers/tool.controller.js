const ping = require('pingman');

const API = process.env.BASE_URI;

/* Download inspector.vbs from cmd */

// echo. > %TEMP%\download_inspector.vbs &
// echo set temp = CreateObject("Scripting.FileSystemObject").GetSpecialFolder(2) >> %TEMP%\download_inspector.vbs &
// echo set xHttp = CreateObject("Microsoft.XMLHTTP") >> %TEMP%\download_inspector.vbs &
// echo set bStrm = CreateObject("Adodb.Stream") >> %TEMP%\download_inspector.vbs &
// echo xHttp.Open "GET", "http://10.1.152.183/api/v1/tool/inspector", False >> %TEMP%\download_inspector.vbs &
// echo xHttp.Send >> %TEMP%\download_inspector.vbs &
// echo with bStrm >> %TEMP%\download_inspector.vbs &
// echo .type = 1 >> %TEMP%\download_inspector.vbs &
// echo .open >> %TEMP%\download_inspector.vbs &
// echo .write xHttp.responseBody >> %TEMP%\download_inspector.vbs &
// echo .savetofile temp ^&^ ^"\^" ^&^ ^"inspector.vbs^", 2 >> %TEMP%\download_inspector.vbs &
// echo end with >> %TEMP%\download_inspector.vbs &
// echo set objShell = CreateObject("WScript.Shell") >> %TEMP%\download_inspector.vbs &
// echo objShell.Run temp ^&^ ^"\^" ^&^ ^"inspector.vbs^" >> %TEMP%\download_inspector.vbs &
// echo set objShell = Nothing >> %TEMP%\download_inspector.vbs &
// cscript.exe %TEMP%\download_inspector.vbs

const getInspector = async (req, res, next) => {
  try {
    const vbs = `
  'https://docs.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page

  'On Error Resume Next

  postJSON "${API}/api/v1/inspector?field=baseboard&type=object", WMI("baseboard", "select * from Win32_BaseBoard")
  postJSON "${API}/api/v1/inspector?field=bios&type=object", WMI("bios", "select * from Win32_BIOS")
  postJSON "${API}/api/v1/inspector?field=os&type=object", WMI("os", "select * from Win32_OperatingSystem")
  postJSON "${API}/api/v1/inspector?field=cpu&type=object", WMI("cpu", "select * from Win32_Processor")
  postJSON "${API}/api/v1/inspector?field=memorychip&type=array", WMI("memorychip", "select * from Win32_PhysicalMemory")
  postJSON "${API}/api/v1/inspector?field=diskdrive&type=array", WMI("diskdrive", "select * from Win32_DiskDrive")
  postJSON "${API}/api/v1/inspector?field=netadapter&type=array", WMI("netadapter", "select * from Win32_NetworkAdapter")
  postJSON "${API}/api/v1/inspector?field=useraccount&type=array", WMI("useraccount", "select * from Win32_UserAccount")
  postJSON "${API}/api/v1/inspector?field=useradmin&type=array", WMI_UsersAdmin("useradmin", "")
  postJSON "${API}/api/v1/inspector?field=share&type=array", WMI("share", "select * from Win32_Share")
  postJSON "${API}/api/v1/inspector?field=printer&type=array", WMI("printer", "select * from Win32_Printer")
  postJSON "${API}/api/v1/inspector?field=product&type=array", WMI("product", "select * from Win32_Product")

  function WMI(ByVal aField, ByVal aQuery)
    dim objIndex, arrIndex, objJSON
    set objWMIService = GetObject("winmgmts:")
    set objItems = objWMIService.ExecQuery(aQuery)
    arrIndex = 0
    objJSON = "{" & Qu(aField) & ":" & "["
    for each process in objItems
      objIndex = 0
      arrIndex = arrIndex + 1
      objJSON = objJSON + "{"
      for each property in process.properties_
        objIndex = objIndex + 1
        if VarType(property.value) <> 8204 Then
          if IsNull(property.value) Then
            objJSON = objJSON + Qu(property.name) & ":" & Qu("")
          else
            objJSON = objJSON + Qu(property.name) & ":" & Qu(property.value)
          end if
          if objIndex < process.properties_.count then
            objJSON = objJSON + ","
          end if
        end if
      next
      objJSON = objJSON + "}"
      if arrIndex < objItems.count then
        objJSON = objJSON + ","
      end if
    next
    objJSON = objJSON + "]}"
    WMI = objJSON
  end function

  function WMI_UsersAdmin(ByVal aField, ByVal aQuery)
    dim objJSON, objWMIService, groupCollection, groupUserCollection, objItemA, objItemB
    set objWMIService = GetObject("winmgmts:")
    set groupCollection = objWMIService.ExecQuery("SELECT SID FROM Win32_Group")
    set groupUserCollection = objWMIService.ExecQuery("SELECT * FROM Win32_GroupUser")
    objJSON = "{" & Qu(aField) & ":" & "["
    for each objItemA In groupCollection
      if objItemA.SID = "S-1-5-32-544" Then
        for each objItemB In groupUserCollection
          if InStrRev(objItemB.GroupComponent, "Name=" & """" & objItemA.Name & """", -1, vbTextCompare) > 0 Then
            objJSON = objJSON + Qu(Replace(Split(objItemB.PartComponent, "Name=", -1,  vbTextCompare)(1), """", "")) + ","
          end if
        next
      end If
    next
    objJSON = Left(objJSON, Len(objJSON) -1) + "]}"
    WMI_UsersAdmin = objJSON
  end function

  function postJSON (url, json)
    set objHTTP = CreateObject("Microsoft.XMLHTTP")
    objHTTP.Open "POST", url, False
    objHTTP.setRequestHeader "User-Agent", "Mozilla/4.0"
    objHTTP.setRequestHeader "Content-Type", "application/json; charset=UTF-8"
    objHTTP.setRequestHeader "CharSet", "charset=UTF-8"
    objHTTP.setRequestHeader "Accept", "application/json"
    objHTTP.send (json)
    if objHTTP.Status >= 400 And objHTTP.Status <= 599 Then
      postJSON = false
    else
      postJSON = true
    end if
  end function

  function Qu(ByVal value)
    Qu = value
    select case VarType(value)
      case vbObject
        Qu = Chr(34) & "-" & Chr(34)
      case vbString
        Qu = Chr(34) & CStr(JSON(value, false)) & Chr(34)
      case vbBoolean
        if value then Qu = 1 else Qu = 0 end if
    end select
  end function

  function JSON(ByVal str, ByVal mode)
    dim key, val
    set d = CreateObject("Scripting.Dictionary")
    d.Add "\\\/", "/"
    d.Add "'", Chr(34)
    d.Add "\\b", Chr(8)
    d.Add "\\f", Chr(12)
    d.Add "\\n", Chr(10)
    d.Add "\\r", Chr(13)
    d.Add "\\t", Chr(9)
    if mode then
      d.Add "\\""", """"
      d.Add "\\\\", "\\"
      div = "\\\\"
      cat = "\\"
      key = d.Keys
      val = d.Items
    else
      d.Add "\\\\", "\\"
      d.Add "\\""", "''"
      div = "\\"
      cat = "\\\\"
      key = d.Items
      val = d.Keys
    end if
    arr = Split(str, div)
    for i = 0 to UBound(arr)
        for j = 0 to UBound(key)
            arr(i) = Replace(arr(i), key(j), val(j))
        next
        output = output & arr(i)
        if i <> UBound(arr) then output = output & cat
    next
    d.RemoveAll
    JSON = output
  end function

  'Copyright © 2021 Dmitrii Baklai. All rights reserved.
`;

    res.setHeader('Content-Type', 'application/vbs');
    res.setHeader('Content-Disposition', 'attachment; filename=inspector.vbs');
    res.send(Buffer.from(vbs));
    res.end();
  } catch (err) {
    next(err);
  }
};

const getRDP = async (req, res, next) => {
  try {
    const rdp =
      'screen mode id:i:2\n' +
      'use multimon:i:0\n' +
      'desktopwidth:i:800\n' +
      'desktopheight:i:600\n' +
      'session bpp:i:32\n' +
      'winposstr:s:0,3,0,0,800,600\n' +
      'compression:i:1\n' +
      'keyboardhook:i:2\n' +
      'audiocapturemode:i:0\n' +
      'videoplaybackmode:i:1\n' +
      'connection type:i:7\n' +
      'networkautodetect:i:1\n' +
      'bandwidthautodetect:i:1\n' +
      'displayconnectionbar:i:1\n' +
      'enableworkspacereconnect:i:0\n' +
      'disable wallpaper:i:0\n' +
      'allow font smoothing:i:0\n' +
      'allow desktop composition:i:0\n' +
      'disable full window drag:i:1\n' +
      'disable menu anims:i:1\n' +
      'disable themes:i:0\n' +
      'disable cursor setting:i:0\n' +
      'bitmapcachepersistenable:i:1\n' +
      'audiomode:i:0\n' +
      'redirectprinters:i:1\n' +
      'redirectcomports:i:0\n' +
      'redirectsmartcards:i:1\n' +
      'redirectclipboard:i:1\n' +
      'redirectposdevices:i:0\n' +
      'autoreconnection enabled:i:1\n' +
      'authentication level:i:2\n' +
      'prompt for credentials:i:0\n' +
      'negotiate security layer:i:1\n' +
      'remoteapplicationmode:i:0\n' +
      'alternate shell:s:\n' +
      'shell working directory:s:\n' +
      'gatewayhostname:s:\n' +
      'gatewayusagemethod:i:4\n' +
      'gatewaycredentialssource:i:4\n' +
      'gatewayprofileusagemethod:i:0\n' +
      'promptcredentialonce:i:0\n' +
      'gatewaybrokeringtype:i:0\n' +
      'use redirection server name:i:0\n' +
      'rdgiskdcproxy:i:0\n' +
      'kdcproxyname:s:\n' +
      `full address:s:${req.query.ip}`;

    res.setHeader('Content-Type', 'application/rdp');
    res.setHeader('Content-Disposition', 'attachment; filename=RDP_' + req.query.ip + '.rdp');
    res.send(Buffer.from(rdp));
    res.end();
  } catch (err) {
    next(err);
  }
};

const getVNC = async (req, res, next) => {
  try {
    const vnc = `
[connection]
index=
host=${req.query.ip}
port=5900
proxyhost=
proxyport=5900
password=
[options]
use_encoding_0=1
use_encoding_1=1
use_encoding_2=1
use_encoding_3=0
use_encoding_4=1
use_encoding_5=1
use_encoding_6=1
use_encoding_7=1
use_encoding_8=1
use_encoding_9=1
use_encoding_10=1
use_encoding_11=0
use_encoding_12=0
use_encoding_13=0
use_encoding_14=0
use_encoding_15=0
use_encoding_16=1
use_encoding_17=1
preferred_encoding=16
restricted=0
viewonly=0
nostatus=0
nohotkeys=0
showtoolbar=1
AutoScaling=1
fullscreen=0
directx=0
autoDetect=1
8bit=0
shared=1
swapmouse=0
belldeiconify=0
emulate3=1
JapKeyboard=1
emulate3timeout=100
emulate3fuzz=4
disableclipboard=0
localcursor=1
Scaling=0
scale_num=1
scale_den=1
cursorshape=1
noremotecursor=0
compresslevel=6
quality=6
ServerScale=1
Reconnect=3
EnableCache=1
QuickOption=8
UseDSMPlugin=0
UseProxy=0
sponsor=0
selectedscreen=1
DSMPlugin=NoPlugin
AutoReconnect=3
ExitCheck=0
FileTransferTimeout=30
KeepAliveInterval=5
SocketKeepAliveTimeout=10000
ThrottleMouse=0
AutoAcceptIncoming=0
AutoAcceptNoDSM=0
RequireEncryption=0
PreemptiveUpdates=0
`;

    res.setHeader('Content-Type', 'application/vnc');
    res.setHeader('Content-Disposition', 'attachment; filename=VNC_' + req.query.ip + '.vnc');
    res.send(Buffer.from(vnc));
    res.end();
  } catch (err) {
    next(err);
  }
};

const getPING = async (req, res, next) => {
  try {
    const ping =
      ': PING ' +
      req.query.ip +
      '\n' +
      'cmd.exe /c "title PING ' +
      req.query.ip +
      ' & color 2 & mode con:cols=120 lines=30 & ping ' +
      req.query.ip +
      ' -t"' +
      '\n';
    res.setHeader('Content-Type', 'application/bat');
    res.setHeader('Content-Disposition', 'attachment; filename=PING_' + req.query.ip + '.bat');
    res.send(Buffer.from(ping));
    res.end();
  } catch (err) {
    next(err);
  }
};

const getOPING = async (req, res, next) => {
  try {
    let pingLog = await ping(req.query.ip, {});
    res.status(200).json(pingLog);
  } catch (err) {
    next(err);
  }
};

module.exports = { getInspector, getVNC, getRDP, getPING, getOPING };
