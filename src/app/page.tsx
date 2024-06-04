import CvUpload from "@/components/upload/cv-upload";
import CandidateList from "@/components/candidate-list/candidate-list";

export default function Page() {
  return (
    <div className="container mx-auto">
      <CvUpload />
      <CandidateList />
    </div>
  );
}
