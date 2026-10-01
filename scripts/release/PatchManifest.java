import com.android.aapt.Resources.Item;
import com.android.aapt.Resources.Primitive;
import com.android.aapt.Resources.XmlAttribute;
import com.android.aapt.Resources.XmlElement;
import com.android.aapt.Resources.XmlNode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/** يضبط versionCode و versionName في AndroidManifest.xml بصيغة proto (صيغة حزم AAB). */
public class PatchManifest {
    public static void main(String[] a) throws Exception {
        Path p = Paths.get(a[0]);
        int code = Integer.parseInt(a[1]);
        String name = a[2];
        XmlNode root = XmlNode.parseFrom(Files.readAllBytes(p));
        XmlElement.Builder el = root.getElement().toBuilder();
        boolean c = false, n = false;
        for (int i = 0; i < el.getAttributeCount(); i++) {
            XmlAttribute at = el.getAttribute(i);
            if (at.getName().equals("versionCode")) {
                el.setAttribute(i, at.toBuilder().setValue(Integer.toString(code))
                    .setCompiledItem(Item.newBuilder().setPrim(Primitive.newBuilder().setIntDecimalValue(code))));
                c = true;
            } else if (at.getName().equals("versionName")) {
                el.setAttribute(i, at.toBuilder().setValue(name)
                    .setCompiledItem(Item.newBuilder().setStr(
                        com.android.aapt.Resources.String.newBuilder().setValue(name))));
                n = true;
            }
        }
        if (!c || !n) throw new IllegalStateException("versionCode أو versionName غير موجود في الملف");
        Files.write(p, root.toBuilder().setElement(el).build().toByteArray());
        System.out.println("versionCode=" + code + " versionName=" + name);
    }
}
