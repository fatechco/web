import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { Story } from "@/types/story";
import { storyTiming } from "@/config/global";
import { useSwiper } from "swiper/react";
import { Button } from "@/components/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCountDown } from "@/hook/use-countdown";
import { StoryLine } from "./story-line";
import { StoryHeader } from "./story-header";
import { SingleStory } from "./story";
import { useStories } from "./stories.provider";
import { Types } from "./stories.reducer";

interface SubStoriesProps {
  stories: Story[];
  onCloseModal: () => void;
  mainStoriesLength: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export const SubStories = ({
  stories,
  onCloseModal,
  mainStoriesLength,
  hasPrev,
  hasNext,
}: SubStoriesProps) => {
  const { t } = useTranslation();
  const mainSwiper = useSwiper();
  const { dispatch, state } = useStories();
  const { counter: time, reset, start } = useCountDown(storyTiming);
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentStory = stories[state.sub];
  const currentStoryModelType = currentStory?.model_type?.split("\\")?.pop()?.toLowerCase();

  const getUrl = () => {
    switch (currentStoryModelType) {
      case "shop":
        return `/shops/${currentStory?.shop_slug}`;
      case "product":
        return `/products/${currentStory?.model_uuid}`;
      case "service":
        return `/shops/${currentStory?.shop_slug}/booking?serviceId=${currentStory?.model_uuid}`;
      default:
        return `/shops/${currentStory?.shop_slug}`;
    }
  };

  const handleSwipeNext = () => {
    if (state.sub < stories.length - 1) {
      dispatch({ type: Types.ChangeSubStoryIndex, payload: state.sub + 1 });
    } else if (mainStoriesLength > mainSwiper?.realIndex) {
      mainSwiper?.slideNext();
      dispatch({ type: Types.ChangeMainStoryIndex, payload: state.main + 1 });
    } else if (mainStoriesLength === mainSwiper?.realIndex) {
      dispatch({ type: Types.ToggleModal, payload: { storyIndex: -1 } });
    }
  };

  const handleSwipePrev = () => {
    if (state.sub > 0 && stories.length !== 1) {
      dispatch({ type: Types.ChangeSubStoryIndex, payload: state.sub - 1 });
      reset();
    } else if (mainStoriesLength >= mainSwiper?.realIndex) {
      mainSwiper?.slidePrev();
      dispatch({ type: Types.ChangeMainStoryIndex, payload: state.main - 1 });
    }
  };

  useEffect(() => {
    if (imageLoaded) {
      start();
    }
  }, [state.main, state.sub, imageLoaded]);

  useEffect(() => {
    if (!time) {
      handleSwipeNext();
      reset();
    }
  }, [time]);

  return (
    <>
      <div className="flex items-center gap-2.5 absolute top-0 left-0 w-full z-10 p-2">
        {Array.from(Array(stories.length).keys()).map((step, idx) => (
          <StoryLine
            time={time}
            lineIdx={idx}
            key={step}
            currentIdx={state.sub}
            isBefore={state.sub > idx}
          />
        ))}
      </div>
      <StoryHeader story={stories[state.sub]} onClose={onCloseModal} />
      <SingleStory data={stories[state.sub]} onLoad={() => setImageLoaded(true)} />

      {hasPrev && (
        <button
          className="md:h-12 md:w-12 md:rounded-full md:bottom-1/2 md:translate-y-1/2 md:bg-[#484848] text-white md:inline-flex md:justify-center md:items-center md:-left-14 md:border h-4/5 flex-1 w-1/2 absolute bottom-0 left-0 z-10"
          aria-label="prev"
          onClick={handleSwipePrev}
        >
          <ArrowLeftSLineIcon className="hidden md:block" size={30} />
        </button>
      )}
      {hasNext && (
        <button
          className="md:h-12 md:w-12 md:rounded-full md:bottom-1/2 md:translate-y-1/2 md:bg-[#484848] text-white md:-right-14 md:border md:inline-flex md:justify-center md:items-center h-4/5 flex-1 w-1/2 absolute bottom-0 right-0 z-10"
          aria-label="next"
          onClick={handleSwipeNext}
        >
          <ArrowRightSLineIcon className="hidden md:block" size={30} />
        </button>
      )}
      <div className="absolute z-10 w-full bottom-0 left-0 p-2">
        <Button as={Link} onClick={onCloseModal} href={getUrl()} fullWidth>
          {t(`view.${currentStoryModelType}`)}
        </Button>
      </div>
    </>
  );
};
