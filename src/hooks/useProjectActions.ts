import { useEditorStore } from '../store';

export function useProjectActions() {
  const handleExport = () => {
    const project = useEditorStore.getState().project;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const fileName = project.title ? `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json` : 'sticktalk_project.json';
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          useEditorStore.setState({ project: json, currentTime: 0 });
        } catch (err) {
          alert("Lỗi đọc file: " + err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return { handleExport, handleImport };
}
