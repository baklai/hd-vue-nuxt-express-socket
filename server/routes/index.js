const { Router } = require('express');

const Inspector = require('../models/inspector.model');

const router = Router({ mergeParams: true });

const downloadVBS = async (req, res, next) => {
  /* Download inspector.vbs from cmd */

  // echo. > %TEMP%\download_inspector.vbs &
  // echo set temp = CreateObject("Scripting.FileSystemObject").GetSpecialFolder(2) >> %TEMP%\download_inspector.vbs &
  // echo set xHttp = CreateObject("Microsoft.XMLHTTP") >> %TEMP%\download_inspector.vbs &
  // echo set bStrm = CreateObject("Adodb.Stream") >> %TEMP%\download_inspector.vbs &
  // echo xHttp.Open "GET", "http://HOST/api/inspector", False >> %TEMP%\download_inspector.vbs &
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

  const API = `${req.protocol}://${req.get('host')}`;

  try {
    const vbs = `
      'https://docs.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page

      'On Error Resume Next

      postJSON "${API}/api/inspector?field=baseboard&type=object", WMI("baseboard", "select * from Win32_BaseBoard")
      postJSON "${API}/api/inspector?field=bios&type=object", WMI("bios", "select * from Win32_BIOS")
      postJSON "${API}/api/inspector?field=os&type=object", WMI("os", "select * from Win32_OperatingSystem")
      postJSON "${API}/api/inspector?field=cpu&type=object", WMI("cpu", "select * from Win32_Processor")
      postJSON "${API}/api/inspector?field=memorychip&type=array", WMI("memorychip", "select * from Win32_PhysicalMemory")
      postJSON "${API}/api/inspector?field=diskdrive&type=array", WMI("diskdrive", "select * from Win32_DiskDrive")
      postJSON "${API}/api/inspector?field=netadapter&type=array", WMI("netadapter", "select * from Win32_NetworkAdapter")
      postJSON "${API}/api/inspector?field=useraccount&type=array", WMI("useraccount", "select * from Win32_UserAccount")
      postJSON "${API}/api/inspector?field=useradmin&type=array", WMI_UsersAdmin("useradmin", "")
      postJSON "${API}/api/inspector?field=share&type=array", WMI("share", "select * from Win32_Share")
      postJSON "${API}/api/inspector?field=printer&type=array", WMI("printer", "select * from Win32_Printer")
      postJSON "${API}/api/inspector?field=product&type=array", WMI("product", "select * from Win32_Product")

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

      'Copyright © ${new Date().getFullYear()} Dmitrii Baklai. All rights reserved.`;

    res.setHeader('Content-Type', 'application/vbs');
    res.setHeader('Content-Disposition', 'attachment; filename=inspector.vbs');
    res.send(Buffer.from(vbs));
    res.end();
  } catch (err) {
    next(err);
  }
};

const createReport = async (req, res, next) => {
  try {
    const ipaddress =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress.replace(/^.*:/, '');
    await Inspector.findOneAndUpdate(
      {
        host: ipaddress
      },
      {
        host: ipaddress,
        [req.query.field]:
          req.query.type === 'object' ? req.body[req.query.field][0] : req.body[req.query.field]
      },
      {
        new: true,
        upsert: true,
        rawResult: true
      }
    );
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

router.route('/inspector').get(downloadVBS).post(createReport);

module.exports = router;
