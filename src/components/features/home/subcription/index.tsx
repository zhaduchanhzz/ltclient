import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { Divider } from "@mui/material";
import ComparePackage from "./components/ComparePackage";
import IntroducePack from "./components/IntroducePack";
import PriceList from "./components/PriceList";
import SystemFunction from "./components/SystemFunction";
import VstepBenefits from "./components/VstepBenefits";
import { MARK_SUBSCRIPTIONS, VIP_SUBSCRIPTIONS } from "./utils/subs";
import Feedback from "./components/Feedback";
import PurchaseGuide from "./components/PurchaseGuide";
import ServcesPackage from "./components/ServcesPackage";
import FAQs from "./components/FAQs";

type SubcriptionProps = {};

const Subcription = (_: SubcriptionProps) => {
  return (
    <BasicBox sx={{ mx: "auto", width: { xs: "80%", xl: "1200px" } }}>
      <BasicStack>
        <BasicStack>
          <IntroducePack id="gioi-thieu-goi" />
        </BasicStack>
        {/* Features Section */}
        <Divider sx={{ my: 4, p: 2 }} />

        <BasicStack>
          <ServcesPackage id="goi-dich-vu-vstep" />
        </BasicStack>
        {/* System Function Section */}
        <BasicStack>
          <SystemFunction id="chuc-nang-he-thong" />
        </BasicStack>
        <Divider sx={{ my: 4, p: 2 }} />
        {/* Vstep Benefits Section */}
        <BasicStack>
          <VstepBenefits id="loi-ich-vstep" />
        </BasicStack>
        {/* Compare Package Section */}
        <BasicStack>
          <ComparePackage id="so-sanh-goi-tai-khoan" />
        </BasicStack>

        <BasicStack>
          <PriceList
            id="gia-goi-dich-vu-vstep"
            VIP_SUBSCRIPTIONS={VIP_SUBSCRIPTIONS}
            MARK_SUBSCRIPTIONS={MARK_SUBSCRIPTIONS}
          />
        </BasicStack>
        <Divider sx={{ my: 4, p: 2 }} />

        <BasicStack>
          <Feedback id="phan-hoi-thi-sinh" />
        </BasicStack>

        <BasicStack>
          <PurchaseGuide id="huong-dan-mua-goi" />
        </BasicStack>

        <BasicStack>
          <FAQs id="faq" />
        </BasicStack>
      </BasicStack>
    </BasicBox>
  );
};

export default Subcription;
