<?php

/**
 * CLI script to update page content with inline SpeechPro code
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../config.php');

$admin = get_admin();
\core\session\manager::set_user($admin);

// Get the page
$page = $DB->get_record('page', ['id' => 17], '*', MUST_EXIST);

// Create inline content without iframe
$content = <<<HTML
<div class="local-speechpro-embedded">
    <div class="card">
        <div class="card-body">
            <h3 class="mb-3">SpeechPro 발음 평가</h3>
            <p class="text-muted">텍스트를 입력하고 녹음 버튼을 눌러 발음을 평가받으세요.</p>

            <div class="form-group mb-3">
                <label for="speechpro-text">평가할 텍스트</label>
              <select id="speechpro-text" class="form-control">
                <option value="완벽을 기다리면 영원히 시작 못 한다.">완벽을 기다리면 영원히 시작 못 한다.</option>
                <option value="생각은 무료지만, 행동은 인생을 바꾼다.">생각은 무료지만, 행동은 인생을 바꾼다.</option>
                <option value="오늘 안 하면 내일도 안 한다.">오늘 안 하면 내일도 안 한다.</option>
                <option value="의욕이 생겨서 하는 게 아니라, 하다 보면 의욕이 생긴다.">의욕이 생겨서 하는 게 아니라, 하다 보면 의욕이 생긴다.</option>
                <option value="실패는 데이터고, 포기는 종료다.">실패는 데이터고, 포기는 종료다.</option>
                <option value="결정이 빠른 사람이 결국 멀리 간다.">결정이 빠른 사람이 결국 멀리 간다.</option>
                <option value="환경을 탓하기 전에, 루틴을 먼저 바꿔라.">환경을 탓하기 전에, 루틴을 먼저 바꿔라.</option>
                <option value="머릿속 시뮬레이션은 아무도 안 알아준다.">머릿속 시뮬레이션은 아무도 안 알아준다.</option>
                <option value="작게 시작해도 좋다. 안 시작하는 게 문제다.">작게 시작해도 좋다. 안 시작하는 게 문제다.</option>
                <option value="지금의 귀찮음이 미래의 자유를 만든다.">지금의 귀찮음이 미래의 자유를 만든다.</option>
              </select>
            </div>

            <div class="d-flex gap-2 mb-3">
                <button id="speechpro-record" class="btn btn-primary">🎤 녹음 시작</button>
                <button id="speechpro-stop" class="btn btn-secondary" disabled>⏹️ 녹음 중지</button>
                <button id="speechpro-play" class="btn btn-warning" disabled title="녹음한 파일을 재생합니다">▶️ 재생</button>
                <button id="speechpro-evaluate" class="btn btn-success" disabled>✅ 평가하기</button>
            </div>

            <div id="speechpro-audio-player" style="display: none; margin-bottom: 15px;">
                <audio id="speechpro-audio" style="width: 100%; margin-bottom: 10px;" controls></audio>
                <p class="text-muted text-sm">녹음된 음성입니다. 재생 후 평가하기 버튼을 클릭하세요.</p>
            </div>

            <div id="speechpro-status" class="alert alert-info">준비 완료</div>
            <div id="speechpro-result" class="mt-3"></div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  "use strict";

  const textInput = document.getElementById("speechpro-text");
  const recordBtn = document.getElementById("speechpro-record");
  const stopBtn = document.getElementById("speechpro-stop");
  const playBtn = document.getElementById("speechpro-play");
  const evalBtn = document.getElementById("speechpro-evaluate");
  const statusEl = document.getElementById("speechpro-status");
  const resultEl = document.getElementById("speechpro-result");
  const audioPlayer = document.getElementById("speechpro-audio-player");
  const audioElement = document.getElementById("speechpro-audio");

  if (!textInput || !recordBtn || !stopBtn || !playBtn || !evalBtn || !statusEl || !resultEl) {
    console.error('SpeechPro: Required elements not found');
    return;
  }

  console.log('SpeechPro: Initializing...');

  let mediaRecorder = null;
  let recordedChunks = [];
  let recordedBlob = null;
  let countdownTimer = null;
  let isCountingDown = false;

  const setStatus = (msg) => {
    statusEl.className = "alert alert-info";
    statusEl.textContent = msg;
  };

  const setError = (msg) => {
    statusEl.className = "alert alert-danger";
    statusEl.textContent = msg;
  };

  const enableButtons = (rec, stp, ply, evl) => {
    recordBtn.disabled = !rec;
    stopBtn.disabled = !stp;
    playBtn.disabled = !ply;
    evalBtn.disabled = !evl;
  };

  // WAV encoding
  function encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  function convertToWav(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(reader.result, (buffer) => {
          const samples = buffer.getChannelData(0);
          const wav = encodeWav(samples, buffer.sampleRate);
          resolve(wav);
        }, reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      recordedChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        
        // 오디오 플레이어에 녹음 파일 설정
        const audioUrl = URL.createObjectURL(recordedBlob);
        audioElement.src = audioUrl;
        audioPlayer.style.display = "block";
        
        setStatus("녹음 완료. 재생 또는 평가하기 버튼을 클릭하세요.");
        enableButtons(true, false, true, true);
      };

      mediaRecorder.start();
      setStatus("🔴 녹음 중...");
      enableButtons(false, true, false, false);
    } catch (err) {
      setError("마이크 권한을 허용해주세요: " + err.message);
      enableButtons(true, false, false, false);
    }
  };

  recordBtn.addEventListener("click", async () => {
    if (isCountingDown) return;
    isCountingDown = true;
    enableButtons(false, false, false, false);
    let remaining = 3;
    setStatus("녹음 시작까지 " + remaining + "초...");
    countdownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setStatus("녹음 시작까지 " + remaining + "초...");
        return;
      }
      clearInterval(countdownTimer);
      countdownTimer = null;
      isCountingDown = false;
      startRecording();
    }, 1000);
  });

  stopBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  });

  playBtn.addEventListener("click", () => {
    if (!audioElement || !audioElement.src) {
      setError("재생할 녹음 파일이 없습니다.");
      return;
    }
    audioElement.play().catch((err) => {
      setError("오디오 재생 오류: " + err.message);
    });
  });

  evalBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) {
      setError("텍스트를 입력하세요.");
      return;
    }
    if (!recordedBlob) {
      setError("먼저 녹음을 진행하세요.");
      return;
    }

    setStatus("⏳ 평가 중...");
    enableButtons(false, false, false, false);

    try {
      const wavBlob = await convertToWav(recordedBlob);
      const formData = new FormData();
      formData.append("action", "evaluate");
      formData.append("sesskey", M.cfg.sesskey);
      formData.append("text", text);
      formData.append("audio", wavBlob, "recording.wav");

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log("  " + key + ": Blob(" + value.size + " bytes, type: " + value.type + ")");
        } else {
          console.log("  " + key + ": " + value);
        }
      }

      const resp = await fetch("/local/speechpro/ajax.php", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", resp.status);
      const responseText = await resp.text();
      console.log("Response body:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        setError("서버 응답 파싱 오류: " + responseText);
        return;
      }

      if (resp.status === 200 && data.success) {
        let displayScore = data.score;
        if ((displayScore === null || displayScore === undefined) && data.scoreData && data.scoreData.result && data.scoreData.result.quality && Array.isArray(data.scoreData.result.quality.sentences)) {
          const sentences = data.scoreData.result.quality.sentences;
          const targetSentence = sentences.find((s) => s && s.text && s.text !== "!SIL");
          if (targetSentence && typeof targetSentence.score === "number") {
            displayScore = targetSentence.score;
          }
        }
        const scoreDataHtml = data.scoreData
          ? '<details class="mt-3"><summary>scoreData 전체 보기</summary><pre style="white-space: pre-wrap; word-break: break-word;">' +
            JSON.stringify(data.scoreData, null, 2) +
            '</pre></details>'
          : '';
        resultEl.innerHTML = '<div class="alert alert-success">' +
          '<h5>평가 완료!</h5>' +
          '<p><strong>점수:</strong> ' + (displayScore !== null && displayScore !== undefined ? displayScore : "N/A") + '</p>' +
          '<p><strong>텍스트:</strong> ' + (data.text || text) + '</p>' +
          scoreDataHtml +
          '</div>';
        setStatus("✅ 평가 완료");
      } else {
        setError("평가 실패 (HTTP " + resp.status + "): " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      setError("네트워크 오류: " + err.message);
      console.error("Error:", err);
    } finally {
      enableButtons(true, false, true, false);
    }
  });
});
</script>

<style>
.local-speechpro-embedded {
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}

.local-speechpro-embedded .card {
  width: 100%;
  max-width: none;
  margin: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.2);
  border-radius: 16px;
  background: #ffffff;
}

.local-speechpro-embedded .card-body {
  padding: 2rem;
}

.local-speechpro-embedded h3 {
  color: #1e3a8a;
  font-weight: 700;
}

.local-speechpro-embedded .text-muted {
  color: #475569 !important;
}

.local-speechpro-embedded .form-control {
  border: 2px solid #cbd5f5;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.2s;
}

.local-speechpro-embedded .form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  outline: none;
}

.local-speechpro-embedded .btn {
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border: none !important;
  transition: all 0.2s;
}

.local-speechpro-embedded .btn-primary {
  background: linear-gradient(135deg, #1e3a8a, #2563eb) !important;
  color: white !important;
}

.local-speechpro-embedded .btn-primary:hover {
  background: linear-gradient(135deg, #1e40af, #1d4ed8) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
}

.local-speechpro-embedded .btn-secondary {
  background: #475569 !important;
  color: white !important;
}

.local-speechpro-embedded .btn-secondary:hover {
  background: #334155 !important;
}

.local-speechpro-embedded .btn-success {
  background: linear-gradient(135deg, #0f172a, #1e3a8a) !important;
  color: white !important;
}

.local-speechpro-embedded .btn-success:hover {
  background: linear-gradient(135deg, #1e293b, #1e40af) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3) !important;
}

.local-speechpro-embedded .btn-info {
  background: linear-gradient(135deg, #1e3a8a, #2563eb) !important;
  color: white !important;
}

.local-speechpro-embedded .btn-info:hover {
  background: linear-gradient(135deg, #1e40af, #1d4ed8) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
}

.local-speechpro-embedded .alert-info {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  color: #1e3a8a;
  border-radius: 8px;
}

.local-speechpro-embedded .alert-danger {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 8px;
}

.local-speechpro-embedded .alert-success {
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  border-radius: 8px;
}

.d-flex.gap-2 > * {
  margin-right: 0.5rem;
}
</style>
HTML;

// Update page content
$page->content = $content;
$page->contentformat = FORMAT_HTML; // Set to HTML format
$page->timemodified = time();
$DB->update_record('page', $page);

// Clear cache
purge_all_caches();

echo "✅ Page content updated successfully!\n";
echo "Page ID: {$page->id}\n";
echo "Format: HTML\n";
echo "Cache: Cleared\n";
echo "URL: http://localhost:8888/mod/page/view.php?id=73\n";
