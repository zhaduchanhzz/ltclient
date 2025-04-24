import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useExamContext, useExamContextHandle } from "@/contexts/ExamContext";
import { useMediaQuery, useTheme } from "@mui/material";
import { examSections, examTab } from "../utils/data";
import PartButton from "./PartButton";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/common/Dialog/ConfirmDialog";

type ExamLayoutFooterProps = {};

const ExamLayoutFooter = (_: ExamLayoutFooterProps) => {
  const theme = useTheme();
  const isUpSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { currentTab, currentSection, completedSections } = useExamContext();
  const [openNextDialog, setOpenNextDialog] = useState<boolean>(false);
  const { updateExamContextState } = useExamContextHandle();
  // Check if current section is the last one
  const isLastSection =
    currentSection === examSections[examSections.length - 1];

  useEffect(() => {
    // set current selection and tab when init screen
  }, []);

  useEffect(() => {
    // move the next section then move to the first part of this section too
    const currentIndex = examSections.indexOf(currentSection);

    if (currentIndex !== -1) {
      const firstPartOfSection = Object.values(examTab)[currentIndex]?.PART_1;

      if (firstPartOfSection) {
        updateExamContextState({ currentTab: firstPartOfSection });
      }
    }
  }, [currentSection]);

  const setCurrentExamTab = (tab: string) => () => {
    updateExamContextState({ currentTab: tab });
  };

  const onClickContinue = () => {
    setOpenNextDialog(true);
  };

  const handleConfirmNext = () => {
    updateExamContextState({
      completedSections: { ...completedSections, [currentSection]: true },
    });

    const currentIndex = examSections.indexOf(currentSection);

    if (currentIndex < examSections.length - 1) {
      updateExamContextState({
        currentSection: examSections[currentIndex + 1],
      });
    }

    setOpenNextDialog(false);
  };

  const onClickSave = () => {};

  return (
    <BasicStack
      direction="row"
      sx={{
        p: 2,
        alignItems: "center",
        justifyContent: "center",
        height: 90,
        position: "fixed",
        bottom: 0,
        width: 1,
        backgroundColor: theme.palette.background.default,
        borderTop: "2px solid" + theme.palette.customStyle.borderColor.primary,
      }}
    >
      <BasicStack spacing={2} direction="row">
        <BasicStack
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <BasicStack spacing={1} direction="row">
            <PartButton
              text="Part 1"
              onClick={setCurrentExamTab(examTab.LISTENING.PART_1)}
              isCurrentTab={currentTab === examTab.LISTENING.PART_1}
              isCurrentSection={currentSection === examSections[0]}
            />
            <PartButton
              text="Part 2"
              onClick={setCurrentExamTab(examTab.LISTENING.PART_2)}
              isCurrentTab={currentTab === examTab.LISTENING.PART_2}
              isCurrentSection={currentSection === examSections[0]}
            />
            <PartButton
              text="Part 3"
              onClick={setCurrentExamTab(examTab.LISTENING.PART_3)}
              isCurrentTab={currentTab === examTab.LISTENING.PART_3}
              isCurrentSection={currentSection === examSections[0]}
            />
          </BasicStack>
          <BasicTypography
            variant="body2"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.info.main,
            }}
          >
            Listening - 47
          </BasicTypography>
        </BasicStack>
        <BasicStack
          spacing={1}
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BasicStack spacing={1} direction="row">
            <PartButton
              text="Part 1"
              onClick={setCurrentExamTab(examTab.READING.PART_1)}
              isCurrentTab={currentTab === examTab.READING.PART_1}
              isCurrentSection={currentSection === examSections[1]}
            />
            <PartButton
              text="Part 2"
              onClick={setCurrentExamTab(examTab.READING.PART_2)}
              isCurrentTab={currentTab === examTab.READING.PART_2}
              isCurrentSection={currentSection === examSections[1]}
            />
            <PartButton
              text="Part 3"
              onClick={setCurrentExamTab(examTab.READING.PART_3)}
              isCurrentTab={currentTab === examTab.READING.PART_3}
              isCurrentSection={currentSection === examSections[1]}
            />
            <PartButton
              text="Part 4"
              onClick={setCurrentExamTab(examTab.READING.PART_4)}
              isCurrentTab={currentTab === examTab.READING.PART_4}
              isCurrentSection={currentSection === examSections[1]}
            />
          </BasicStack>
          <BasicTypography
            variant="body2"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.info.main,
            }}
          >
            Reading - 60
          </BasicTypography>
        </BasicStack>
        <BasicStack
          spacing={1}
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BasicStack spacing={1} direction="row">
            <PartButton
              text="Part 1"
              onClick={setCurrentExamTab(examTab.WRITING.PART_1)}
              isCurrentTab={currentTab === examTab.WRITING.PART_1}
              isCurrentSection={currentSection === examSections[2]}
            />
            <PartButton
              text="Part 2"
              onClick={setCurrentExamTab(examTab.WRITING.PART_2)}
              isCurrentTab={currentTab === examTab.WRITING.PART_2}
              isCurrentSection={currentSection === examSections[2]}
            />
          </BasicStack>
          <BasicTypography
            variant="body2"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.info.main,
            }}
          >
            Writing - 60
          </BasicTypography>
        </BasicStack>

        <BasicStack
          spacing={1}
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BasicStack spacing={1}>
            <PartButton
              text="Part 1"
              onClick={setCurrentExamTab(examTab.SPEAKING.PART_1)}
              isCurrentTab={currentTab === examTab.SPEAKING.PART_1}
              isCurrentSection={currentSection === examSections[3]}
            />
          </BasicStack>
          <BasicTypography
            variant="body2"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.info.main,
            }}
          >
            Speaking - 12
          </BasicTypography>
        </BasicStack>
      </BasicStack>
      {!isLastSection && (
        <BasicStack
          spacing={0.5}
          direction={isUpSmScreen ? "row" : "column"}
          sx={{
            px: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BasicButton
            size="small"
            color="info"
            variant="contained"
            onClick={onClickContinue}
          >
            Tiếp {isUpSmScreen ? "tục" : ""}
          </BasicButton>
          <BasicButton
            size="small"
            color="success"
            variant="contained"
            sx={{ ml: 1 }}
            onClick={onClickSave}
          >
            Lưu {isUpSmScreen ? "bài" : ""}
          </BasicButton>
        </BasicStack>
      )}
      <ConfirmDialog
        open={openNextDialog}
        title="Chuyển sang phần thi tiếp theo"
        description="Bạn có chắc chắn muốn chuyển sang phần thi tiếp theo không?"
        onConfirm={handleConfirmNext}
        onClose={() => setOpenNextDialog(false)}
        confirmText="Sang phần tiếp"
        cancelText="Không"
      />
    </BasicStack>
  );
};

export default ExamLayoutFooter;
