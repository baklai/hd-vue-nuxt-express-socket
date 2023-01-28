---
title: Прокси
description: Настройка прокси-сервера
author: Dmitrii Baklai
created: 25.06.2022
category: Интерпретатор командной строки
position: 3
---

Настройка прокси-сервера с помощью команды **[netsh](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/netsh 'Microsoft Dosc')**.
Служебная программа командной строки, которая позволяет отображать или изменять сетевую конфигурацию компьютера, либо локально, либо удаленно.

### Туннелировать весь интернет-трафик через прокси

```
netsh winhttp set proxy proxy-server="http://proxy:port" bypass-list="127.0.0.1;localhost"
```

- `proxy-server` адрес прокси-сервера
- `bypass-list` список исключений, разделенных `;`

### Посмотреть текущие настройки прокси

```
netsh winhttp show proxy
```

### Сбросить все настройки прокси

```
netsh winhttp reset proxy
```
