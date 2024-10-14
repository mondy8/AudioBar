import "./styles.css";
import {
  ChakraProvider,
  Circle,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { secondsToMinutes } from "date-fns";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";

export default function App() {
  /* 音声ファイルを読み込む */
  /* サンプルのため効果音ラボ様のフリー音源を使用　https://soundeffect-lab.info/sound/voice/info-lady1.html */
  const [audio] = useState(
    new Audio(
      "https://soundeffect-lab.info/sound/voice/mp3/info-lady1/info-lady1-odenwaarigatougozaimasu1.mp3"
    )
  );

  /** 音声再生状況をstate管理 */
  const [audioPlaying, setAudioPlaying] = useState(false);

  /** 音声の再生時間（s）をstate管理 */
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  /** 〇〇秒にジャンプ */
  const audioJump = (targetSecond: number) => {
    if (!isNaN(targetSecond) && isFinite(targetSecond)) {
      audio.currentTime = targetSecond;
    }
  };

  /** 再生・停止の更新 */
  useEffect(() => {
    if (audioPlaying) {
      audio.play().catch(() => {
        throw new Error("音声ファイルが見つかりません");
      });
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [audio, audioPlaying]);

  /** 再生終了時の処理 */
  useEffect(() => {
    const onEnded = () => {
      setAudioPlaying(false);
      audio.pause();
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [audio, setAudioPlaying]);

  /** 音声の再生時間を更新する処理 */
  useEffect(() => {
    const onTimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", onTimeupdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
    };
  }, [audio, setAudioCurrentTime]);

  /** 秒数を「00:00」の形式に変換する処理 */
  const getTimeStringFromSeconds = (seconds: number): string => {
    const floorSeconds = Math.floor(seconds);
    const mm = String(secondsToMinutes(floorSeconds) % 60).padStart(2, "0");
    const ss = String(floorSeconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };
  return (
    <ChakraProvider>
      <Flex
        w={"100%"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"gray.100"}
      >
        <HStack
          bg={"#f1e6c5"}
          w={"100%"}
          p={7}
          spacing={7}
          maxW={"80%"}
          rounded={"lg"}
          boxShadow={"inner"}
        >
          <Circle
            as={"button"}
            bg={"#5e7d75"}
            onClick={() => {
              setAudioPlaying((prev) => !prev);
            }}
            size={"37px"}
          >
            <Icon
              as={
                audioPlaying
                  ? BsFillPauseFill
                  : BsFillPlayFill /** 再生アイコン */
              }
              color={"white"}
              fontSize={"24px"}
            />
          </Circle>
          <Slider
            max={audio.duration}
            min={0}
            onChange={audioJump}
            value={audioCurrentTime}
          >
            <SliderTrack bg={"#b9b7a7"} height={"5px"}>
              <SliderFilledTrack bg={"cyan.700"} />
            </SliderTrack>
            <SliderMark
              fontSize={"13px"}
              fontWeight={"bold"}
              textAlign={"center"}
              transform={"translateX(-50%)"}
              value={audioCurrentTime}
              mt={2}
              color={"gray.600"}
            >
              {getTimeStringFromSeconds(audioCurrentTime)}
            </SliderMark>
            <SliderThumb />
          </Slider>
        </HStack>
      </Flex>
    </ChakraProvider>
  );
}
