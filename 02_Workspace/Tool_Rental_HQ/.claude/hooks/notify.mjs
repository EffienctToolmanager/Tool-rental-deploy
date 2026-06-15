import { execSync } from 'child_process';

export function notify(title, message) {
  const cleanTitle = title.replace(/"/g, '\\"');
  const cleanMessage = message.replace(/"/g, '\\"');

  try {
    if (process.platform === 'win32') {
      // Windows: Native PowerShell Balloon Tip Notification (Dependency-free)
      const psCommand = `
        [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms");
        [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing");
        $notification = New-Object System.Windows.Forms.NotifyIcon;
        $notification.Icon = [System.Drawing.SystemIcons]::Information;
        $notification.BalloonTipText = "${cleanMessage}";
        $notification.BalloonTipTitle = "${cleanTitle}";
        $notification.Visible = $true;
        $notification.ShowBalloonTip(5000);
        Start-Sleep -Seconds 1;
        $notification.Dispose();
      `.replace(/\n/g, ' ');

      execSync(`powershell -NoProfile -Command "${psCommand}"`, { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      // macOS: Native AppleScript Notification
      execSync(`osascript -e 'display notification "${cleanMessage}" with title "${cleanTitle}"'`, { stdio: 'ignore' });
    } else if (process.platform === 'linux') {
      // Linux: Native notify-send
      execSync(`notify-send "${cleanTitle}" "${cleanMessage}"`, { stdio: 'ignore' });
    } else {
      console.log(`[Notification] ${title}: ${message}`);
    }
  } catch (err) {
    // Fallback quietly if OS execution fails
    console.log(`[Notification Fallback] ${title}: ${message}`);
  }
}

// Support executing from CLI: node notify.mjs "Title" "Message"
if (process.argv[1] && process.argv[1].endsWith('notify.mjs')) {
  const cliTitle = process.argv[2] || 'Design Harness';
  const cliMessage = process.argv[3] || 'Notification triggered';
  notify(cliTitle, cliMessage);
}
