/**
 * KMS 激活脚本生成器
 * 生成高健壮性的 Windows 和 Office 激活批处理脚本
 */

/**
 * 生成自动提权代码块
 * 检测管理员权限，如果不是管理员则自动提权
 */
function generatePrivilegeEscalation() {
    return `@echo off
chcp 65001 >nul 2>&1
title KMS 激活脚本
color 0A

echo ============================================
echo          KMS 激活脚本 - 自动生成
echo ============================================
echo.

:: ============================================
:: 管理员权限检测与自动提权
:: ============================================
echo [信息] 正在检查管理员权限...

:: 方法1: 使用 net session 检测
net session >nul 2>&1
if %errorlevel% == 0 (
    echo [成功] 已获得管理员权限
    goto :MAIN
)

echo [警告] 未检测到管理员权限，正在尝试提权...
echo.

:: 方法2: 使用 PowerShell 提权 (Windows 10/11 首选)
where powershell >nul 2>&1
if %errorlevel% == 0 (
    echo [信息] 正在通过 PowerShell 请求管理员权限...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    if %errorlevel% == 0 exit /b
)

:: 方法3: 使用 VBScript 提权 (兼容旧版 Windows)
echo [信息] 正在通过 VBScript 请求管理员权限...
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"
echo UAC.ShellExecute "%~f0", "", "", "runas", 1 >> "%temp%\\getadmin.vbs"
cscript //nologo "%temp%\\getadmin.vbs"
del /f /q "%temp%\\getadmin.vbs" >nul 2>&1
exit /b

:MAIN
echo.
echo ============================================
echo          开始执行激活流程
echo ============================================
echo.
`;
}

/**
 * 生成 Windows 激活脚本
 * @param {string} key - GVLK 密钥
 * @param {string} kmsHost - KMS 服务器地址
 * @param {string} version - Windows 版本名称
 */
export function generateWindowsScript(key, kmsHost) {
    // 简化为纯命令行，避免编码/解析问题，使用 CRLF 兼容 cmd
    const lines = [
        '@echo off',
        `slmgr /skms ${kmsHost}`,
        `slmgr /ipk ${key}`,
        'slmgr /ato',
        'slmgr /xpr',
        'pause'
    ];
    return lines.join('\r\n');
}

/**
 * 生成 Office 激活脚本
 * 包含智能路径检测和版本转换功能
 * @param {string} key - GVLK 密钥
 * @param {string} kmsHost - KMS 服务器地址
 * @param {string} version - Office 版本名称
 */
export function generateOfficeScript(key, kmsHost, version) {
    // 简化 Office 激活脚本，使用常见安装路径，避免复杂逻辑导致解析问题
    const lines = [
        '@echo off',
        'setlocal',
        'set "OFFICE_PATH="',
        'if exist "%ProgramFiles%\\Microsoft Office\\root\\Office16\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles%\\Microsoft Office\\root\\Office16"',
        'if exist "%ProgramFiles(x86)%\\Microsoft Office\\root\\Office16\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles(x86)%\\Microsoft Office\\root\\Office16"',
        'if "%OFFICE_PATH%"=="" (',
        '  echo Office not found.',
        '  pause',
        '  exit /b',
        ')',
        'cd /d "%OFFICE_PATH%"',
        `cscript //nologo ospp.vbs /inpkey:${key}`,
        `cscript //nologo ospp.vbs /sethst:${kmsHost}`,
        'cscript //nologo ospp.vbs /setprt:1688',
        'cscript //nologo ospp.vbs /act',
        'cscript //nologo ospp.vbs /dstatus',
        'pause'
    ];
    return lines.join('\\r\\n');
}

/**
 * 生成组合激活脚本 (Windows + Office)
 * @param {Object} windowsConfig - Windows 配置 { key, version }
 * @param {Object} officeConfig - Office 配置 { key, version }
 * @param {string} kmsHost - KMS 服务器地址
 */
export function generateCombinedScript(windowsConfig, officeConfig, kmsHost) {
    const header = generatePrivilegeEscalation();

    let combinedCode = `
echo [模式] 组合激活模式 - Windows + Office
echo.
`;

    // 添加 Windows 激活代码 (如果有)
    if (windowsConfig && windowsConfig.key) {
        combinedCode += `
:: ============================================
:: Windows 激活 - ${windowsConfig.version}
:: ============================================

echo [Windows] 开始激活流程...
echo.

cscript //nologo "%SystemRoot%\\System32\\slmgr.vbs" /ckms >nul 2>&1
cscript //nologo "%SystemRoot%\\System32\\slmgr.vbs" /ipk ${windowsConfig.key}
cscript //nologo "%SystemRoot%\\System32\\slmgr.vbs" /skms ${kmsHost}
cscript //nologo "%SystemRoot%\\System32\\slmgr.vbs" /ato

if %errorlevel% == 0 (
    echo [成功] Windows 激活成功！
) else (
    echo [警告] Windows 激活可能失败
)
echo.
`;
    }

    // 添加 Office 激活代码 (如果有)
    if (officeConfig && officeConfig.key) {
        combinedCode += `
:: ============================================
:: Office 激活 - ${officeConfig.version}
:: ============================================

echo [Office] 开始激活流程...
echo.

:: 搜索 Office 路径
set "OFFICE_PATH="
for %%v in (16 15 14) do (
    if exist "%ProgramFiles%\\Microsoft Office\\Office%%v\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles%\\Microsoft Office\\Office%%v"
    if exist "%ProgramFiles(x86)%\\Microsoft Office\\Office%%v\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles(x86)%\\Microsoft Office\\Office%%v"
    if exist "%ProgramFiles%\\Microsoft Office\\root\\Office%%v\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles%\\Microsoft Office\\root\\Office%%v"
    if exist "%ProgramFiles(x86)%\\Microsoft Office\\root\\Office%%v\\ospp.vbs" set "OFFICE_PATH=%ProgramFiles(x86)%\\Microsoft Office\\root\\Office%%v"
)

if "%OFFICE_PATH%"=="" (
    echo [错误] 未找到 Office 安装目录
) else (
    cd /d "%OFFICE_PATH%"
    cscript //nologo ospp.vbs /inpkey:${officeConfig.key}
    cscript //nologo ospp.vbs /sethst:${kmsHost}
    cscript //nologo ospp.vbs /act
    
    if %errorlevel% == 0 (
        echo [成功] Office 激活成功！
    ) else (
        echo [警告] Office 激活可能失败
    )
)
echo.
`;
    }

    combinedCode += `
echo ============================================
echo          所有激活流程已完成
echo ============================================
echo.
echo 按任意键退出...
pause >nul
exit
`;

    return header + combinedCode;
}

/**
 * 下载 BAT 文件
 * @param {string} content - 脚本内容
 * @param {string} filename - 文件名
 */
export function downloadBatFile(content, filename = 'kms_activate.bat') {
    // 直接使用 UTF-8 文本，无 BOM，纯英文命令避免乱码
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 降级方案：使用 execCommand
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textarea);
        return result;
    }
}

/**
 * 生成单行激活命令（用于直接在命令行执行）
 * @param {string} type - 类型 'windows' 或 'office'
 * @param {string} key - 产品密钥
 * @param {string} kmsHost - KMS 服务器地址
 */
export function generateOneLineCommand(type, key, kmsHost) {
    if (type === 'windows') {
        return `slmgr /skms ${kmsHost} && slmgr /ipk ${key} && slmgr /ato && slmgr /xpr`;
    } else {
        return `cd /d "%ProgramFiles%\\Microsoft Office\\Office16" && cscript ospp.vbs /inpkey:${key} && cscript ospp.vbs /sethst:${kmsHost} && cscript ospp.vbs /act`;
    }
}
